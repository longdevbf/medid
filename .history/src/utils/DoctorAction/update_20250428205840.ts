import {
  CIP68_100,
  stringToHex,
  mConStr0,
  metadataToCip68,
  deserializeAddress,
  MeshTxBuilder,
  BlockfrostProvider,
  applyParamsToScript,
  resolveScriptHash,
  serializeAddressObj,
  serializePlutusScript,
  scriptAddress,
  PlutusScript,
  UTxO,
  BrowserWallet
} from "@meshsdk/core";
import { isNil } from "lodash";
import plutus from '../../../smart_contract/script/plutus.json';
import { getWalletInfoForTx } from './common';

// Platform constants - defined once for the whole application
const PLATFORM = {
  address: "addr_test1qqwkave5e46pelgysvg6mx0st5zhte7gn79srscs8wv2qp5qkfvca3f7kpx3v3rssm4j97f63v5whrj8yvsx6dac9xrqyqqef6",
  fee: "1000000", // 1 ADA in lovelace
  network: "preprod"
};

// Calculate platform derived values
const platformPubKeyHash = deserializeAddress(PLATFORM.address).pubKeyHash;
const platformStakeCredential = deserializeAddress(PLATFORM.address).stakeCredentialHash;

// Blockchain provider
const blockchainProvider = new BlockfrostProvider('preprod2DQWsQjqnzLW9swoBQujfKBIFyYILBiL');

// Helper functions
function readValidator(title: string): string {
  const validator = plutus.validators.find(v => v.title === title);
  if (!validator) throw new Error(`${title} validator not found.`);
  return validator.compiledCode;
}

async function getUtxoForTx(address: string, txHash: string): Promise<UTxO> {
  const utxos = await blockchainProvider.fetchAddressUTxOs(address);
  const utxo = utxos.find(utxo => utxo.input.txHash === txHash);
  if (!utxo) throw new Error(`No UTXOs found for txHash: ${txHash}`);
  return utxo;
}

async function getAddressUTXOAsset(address: string, unit: string): Promise<UTxO> {
  try {
    const utxos = await blockchainProvider.fetchAddressUTxOs(address, unit);
    if (utxos.length === 0) {
      // Try searching all UTXOs at the address if specific asset not found
      console.log("Asset not found with direct query, checking all UTXOs at address...");
      const allUtxos = await blockchainProvider.fetchAddressUTxOs(address);
      console.log(`Found ${allUtxos.length} UTXOs at ${address}`);
      
      // Log all assets in these UTXOs
      console.log("Listing all assets in these UTXOs:");
      allUtxos.forEach((utxo, index) => {
        console.log(`UTXO ${index + 1} (${utxo.input.txHash}):`);
        utxo.output.amount.forEach(asset => {
          console.log(`- ${asset.unit}: ${asset.quantity}`);
        });
      });
      
      throw new Error(`No UTXOs found with asset: ${unit}`);
    }
    
    console.log(`Found ${utxos.length} UTXOs with the asset`);
    console.log(`Found UTXO: ${utxos[utxos.length - 1].input.txHash}`);
    return utxos[utxos.length - 1];
  } catch (error) {
    console.error("Error fetching UTXOs:", error);
    throw error;
  }
}

/**
 * Cập nhật token CIP68
 * @param tokenInfo Thông tin token cần cập nhật
 * @param ownerInfo Thông tin người sở hữu gốc token
 * @returns Transaction hash
 */
interface Metadata{
        _pk: string,  // Dùng pubKeyHash của bệnh nhân
        name: string,
        image: string,
        mediaType: string,
        description: string,
        encryptedData: string,  // URL đã được mã hóa hai lần
       // updateCount: typeof decodedData === 'object' && decodedData?.updates ? decodedData.updates.length + 1 : 1,
        //lastUpdateTime: now,
       lastUpdateBy: string
}
async function updateTokens(
  wallet: BrowserWallet,
  tokenInfo: Array<{ 
    assetName: string; 
    metadata: Metadata; 
    txHash?: string;
  }>,
  ownerInfo: {
    address: string;
    pubKeyHash: string;
  }
): Promise<string> {
  console.log("Starting token update process...");
  
  // Get current wallet information automatically
  const {utxos, walletAddress, collateral} = await getWalletInfoForTx(wallet);
  const { pubKeyHash: userPubKeyHash } = deserializeAddress(walletAddress);
  
  console.log("Current user wallet address:", walletAddress);
  console.log("Current user pubKeyHash:", userPubKeyHash);
  
  // Initialize transaction builder
  const unsignedTx = new MeshTxBuilder({
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    verbose: true,
  });
  
  // Get validators and scripts
  const mintCompilecode = readValidator("mint.mint.mint");
  const storeCompilecode = readValidator("store.store.spend");

  // Apply parameters to store script
  const storeScriptCbor = applyParamsToScript(storeCompilecode, [
    platformPubKeyHash,
    BigInt(1),
    ownerInfo.pubKeyHash
  ]);
  
  // Create store script
  const storeScript: PlutusScript = {
    code: storeScriptCbor,
    version: "V3" as const,
  };
  
  // Calculate store address with stake credential
  const storeAddress = serializeAddressObj(
    scriptAddress(
      deserializeAddress(serializePlutusScript(storeScript, undefined, 0, false).address).scriptHash,
      platformStakeCredential,
      false,
    ),
    0,
  );
  
  console.log("Store address:", storeAddress);
  
  // Calculate mint script and policy ID
  const storeScriptHash = deserializeAddress(storeAddress).scriptHash;
  const mintScriptCbor = applyParamsToScript(mintCompilecode, [
    platformPubKeyHash,
    BigInt(1),
    storeScriptHash,
    platformStakeCredential,
    ownerInfo.pubKeyHash,
  ]);
  const policyId = resolveScriptHash(mintScriptCbor, "V3");
  console.log("Policy ID:", policyId);

  console.log("Building transaction...");
  
  // Process each token update
  await Promise.all(
    tokenInfo.map(async ({ assetName, metadata, txHash }) => {
      console.log(`Asset name (hex): ${stringToHex(assetName)}`);
      const referenceTokenId = policyId + CIP68_100(stringToHex(assetName));
      console.log(`Reference token ID: ${referenceTokenId}`);
      
      console.log(`Searching for asset ${referenceTokenId} at address ${storeAddress}`);
      
      const storeUtxo = !isNil(txHash)
        ? await getUtxoForTx(storeAddress, txHash)
        : await getAddressUTXOAsset(storeAddress, referenceTokenId);
      
      if (!storeUtxo) throw new Error("Store UTXO not found");
      
      // Make sure metadata has _pk field set to owner's pubKeyHash
      if (!metadata._pk) {
        console.log("Adding owner pubKeyHash to metadata _pk field");
        metadata._pk = ownerInfo.pubKeyHash;
      }
      
      // Build token update transaction
      unsignedTx
        .spendingPlutusScriptV3()
        .txIn(storeUtxo.input.txHash, storeUtxo.input.outputIndex)
        .txInInlineDatumPresent()
        .txInRedeemerValue(mConStr0([]))
        .txInScript(storeScriptCbor)
        .txOut(storeAddress, [
          {
            unit: referenceTokenId,
            quantity: "1",
          }
        ])
        .txOutInlineDatumValue(metadataToCip68(metadata));
    }),
  );

  // Add platform fee payment
  unsignedTx
    .txOut(PLATFORM.address, [
      {
        unit: "lovelace",
        quantity: "1000000",
      },  
    ])
    .changeAddress(walletAddress)
    .requiredSignerHash(userPubKeyHash)
    // IMPORTANT: Owner must sign the tx
    .selectUtxosFrom(utxos)
    .txInCollateral(
      collateral.input.txHash, 
      collateral.input.outputIndex,
      collateral.output.amount,
      collateral.output.address
    )
    .setNetwork("preprod");

  
  // Complete transaction
  console.log("Completing transaction...");
  const completedTx = await unsignedTx.complete();
  console.log("txBodyJson", JSON.stringify(completedTx));

  console.log("Signing transaction...");
  const signedTx = await wallet.signTx(completedTx, true);
  console.log("Submitting transaction...");
  
  try {
    const txHashUpdate = await wallet.submitTx(signedTx);
    console.log("Transaction submitted successfully!");
    console.log("Update successful! TxHash: " + txHashUpdate);
    return txHashUpdate;
  } catch (error) {
    console.error("Error submitting transaction:", error);
    throw error;
  }
}
export default updateTokens;
// Main function - now much simpler with only token-specific information
// async function main() {
//   try {
//     console.log("Starting token update process...");
    
//     // Only need to specify token owner information
//     const ownerAddress = "addr_test1qp32dhvj6nmhn8qjce8vsv3s0x70rrth7udxy32a7lm5yl7vchlp2ahqwyyfpv4l7fszccrngx2vcmmu5x3d3t3cy2uqpd7ewx";
//     const ownerPubKeyHash = deserializeAddress(ownerAddress).pubKeyHash;
//     console.log("Using original minter address:", ownerAddress);
//     console.log("Original minter pubKeyHash:", ownerPubKeyHash);
    
//     // Token you want to update (specify just the name and new metadata)
//     const tokenName = "Test function"; // ⚠️ Điền chính xác tên token đã mint
//     const newMetadata = {
//       name: tokenName,
//       image: "ipfs://bafkreihia6lar2ofmpfyuwwmcog7gexlqvwbb2tuhezpouhi4xpvxjju4m",
//       mediaType: "image/jpg",
//       description: "Updated metadata for my CIP68 token",
//       _pk: ownerPubKeyHash, // QUAN TRỌNG: phải giữ giá trị này giống với pubKeyHash của người mint gốc
//       hex: "updated_by_user_B" // Có thể thay đổi giá trị này
//     };
    
//     // Call updateTokens with simplified parameters
//     const result = await updateTokens(
//       [{ assetName: tokenName, metadata: newMetadata }],
//       { address: ownerAddress, pubKeyHash: ownerPubKeyHash }
//     );
    
//     console.log("Update completed with tx hash:", result);
//   } catch (error) {
//     console.error("Error updating tokens:", error);
    
//     // Check if UTXOs were not found
//     if (error.message && error.message.includes("No UTXOs found with asset")) {
//       console.log("Tip: Double-check the asset name and make sure it exists at the store address");
//     }
//   }
// }

// // Run the function
// main();