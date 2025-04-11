import {
    CIP68_100,
    stringToHex,
    mConStr0,
    metadataToCip68,
    deserializeAddress,
    MeshTxBuilder,
    BlockfrostProvider,
    MeshWallet,
    applyParamsToScript,
    resolveScriptHash,
    serializeAddressObj,
    serializePlutusScript,
    scriptAddress,
    PlutusScript,
    UTxO
  } from "@meshsdk/core";
  import { isEmpty, isNil } from "lodash";
  import plutus from '../contract/mint/plutus.json';
  import { getWalletInfoForTx } from '../components/mint/common';
  
  // Constants
  const APP_WALLET_ADDRESS = "addr_test1qqwkave5e46pelgysvg6mx0st5zhte7gn79srscs8wv2qp5qkfvca3f7kpx3v3rssm4j97f63v5whrj8yvsx6dac9xrqyqqef6";
  const appNetwork = "preprod";
  const blockchainProvider = new BlockfrostProvider('preprod2DQWsQjqnzLW9swoBQujfKBIFyYILBiL');
  
  // Helper functions
  function readValidator(title: string): string {
    const validator = plutus.validators.find(v => v.title === title);
    if (!validator) {
      throw new Error(`${title} validator not found.`);
    }
    return validator.compiledCode;
  }
  
  async function getUtxoForTx(address: string, txHash: string): Promise<UTxO> {
    const utxos = await blockchainProvider.fetchAddressUTxOs(address);
    const utxo = utxos.find(utxo => utxo.input.txHash === txHash);
    if (!utxo) throw new Error(`No UTXOs found for txHash: ${txHash}`);
    return utxo;
  }
  
  async function getAddressUTXOAsset(address: string, unit: string): Promise<UTxO> {
    const utxos = await blockchainProvider.fetchAddressUTxOs(address, unit);
    if (utxos.length === 0) throw new Error(`No UTXOs found with asset: ${unit}`);
    return utxos[utxos.length - 1];
  }
   const beneficiary = "addr_test1qp32dhvj6nmhn8qjce8vsv3s0x70rrth7udxy32a7lm5yl7vchlp2ahqwyyfpv4l7fszccrngx2vcmmu5x3d3t3cy2uqpd7ewx";
    const pkb = deserializeAddress(beneficiary).pubKeyHash;
  async function updateTokens(wallet: any, params: { assetName: string; metadata: Record<string, string>; txHash?: string }[]) {
    // Get wallet information
    const { utxos, walletAddress, collateral} = await getWalletInfoForTx(wallet);
    //const utxos = await blockchainProvider.fetchAddressUTxOs(beneficiary);
    const { pubKeyHash: userPubKeyHash } = deserializeAddress(walletAddress);
    const exChange = APP_WALLET_ADDRESS;
    const pubkeyExchange = deserializeAddress(exChange).pubKeyHash;
   
    // Initialize transaction builder
    const unsignedTx = new MeshTxBuilder({
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
      verbose: true,
    });
    
    // Get validators and scripts
    const mintCompilecode = readValidator("mint.mint.mint");
    const storeCompilecode = readValidator("store.store.spend");
    const storeScriptCbor = applyParamsToScript(storeCompilecode, [pubkeyExchange, BigInt(1),pkb, userPubKeyHash]);
        
    const storeScript: PlutusScript = {
      code: storeScriptCbor,
      version: "V3" as "V3",
    };
    
    const storeAddress = serializeAddressObj(
      scriptAddress(
        deserializeAddress(serializePlutusScript(storeScript, undefined, 0, false).address).scriptHash,
        deserializeAddress(exChange).stakeCredentialHash,
        false,
      ),
      0,
    );
    
    const storeScriptHash = deserializeAddress(storeAddress).scriptHash;
    const mintScriptCbor = applyParamsToScript(mintCompilecode, [
      pubkeyExchange,
      BigInt(1),
      storeScriptHash,
      deserializeAddress(exChange).stakeCredentialHash,
      pkb,
    ]);
    const policyId = resolveScriptHash(mintScriptCbor, "V3");
    console.log("Building transaction ...");
    // Process each token update
    await Promise.all(
      params.map(async ({ assetName, metadata, txHash }) => {
        const storeUtxo = !isNil(txHash)
          ? await getUtxoForTx(storeAddress, txHash)
          : await getAddressUTXOAsset(storeAddress, policyId + CIP68_100(stringToHex(assetName)));
        
        if (!storeUtxo) throw new Error("Store UTXO not found");
        
        unsignedTx
          .spendingPlutusScriptV3()
          .txIn(storeUtxo.input.txHash, storeUtxo.input.outputIndex)
          .txInInlineDatumPresent()
          //.spendingReferenceTxInInlineDatumPresent()
          .txInRedeemerValue(mConStr0([]))
          .txInScript(storeScriptCbor)
          .txOut(storeAddress, [
            {
              unit: policyId + CIP68_100(stringToHex(assetName)),
              quantity: "1",
            }
          ])
          .txOutInlineDatumValue(metadataToCip68(metadata))
          
          
      }),
    );
   // const data = await blockchainProvider.fetchAssetMetadata('d40ef252b8e94c27c61a4c9b23e0891a34c18cab62c442f455956687000de14048656c6c6f20576f726c64');
 //   console.log(data);
    // Add platform fee payment             
    unsignedTx
      .txOut(exChange, [
        {
          unit: "lovelace",
          quantity: "1000000", // Platform fee
        },  
      ])
      .changeAddress(walletAddress)
      .requiredSignerHash(userPubKeyHash)
      
      .selectUtxosFrom(utxos)
      .txInCollateral(
        collateral.input.txHash, 
        collateral.input.outputIndex,
        collateral.output.amount,
        collateral.output.address
      )
      .setNetwork(appNetwork);
    
    // Complete, sign, and submit transaction
    console.log("Completing transaction ...");

    const completedTx = await unsignedTx.complete();
    console.log("Signing transaction ...");
    const signedTx = await wallet.signTx(completedTx, true);
    console.log("Submiting transaction ...");
    const txHashUpdate = await wallet.submitTx(signedTx);
    console.log("Transaction submitted successfully !");
    console.log("Update successful! TxHash: " + txHashUpdate);

    return txHashUpdate;
  }
  
//   // Example usage
//   async function main() {
//     try {
//       const {utxos, walletAddress, collateral} = await getWalletInfoForTx(wallet);
//       const { pubKeyHash: userPubKeyHash } = deserializeAddress(walletAddress);
//       const exChange = APP_WALLET_ADDRESS;
//       const pubkeyExchange = deserializeAddress(exChange).pubKeyHash;
//       const result = await updateTokens([
//         {
//           assetName: "sena",
//           metadata:  {
//             _pk: userPubKeyHash,
//            // check: userPubKeyHash,
//             image: "ipfs://bafkreihia6lar2ofmpfyuwwmcog7gexlqvwbb2tuhezpouhi4xpvxjju4m",
//             mediaType: "image/jpg",
//             description: "hello world",
//           }
//         }
//       ]);
      
//       console.log("Transaction hash:", result);
//     } catch (error) {
//       console.error("Error updating tokens:", error);
//     }
//   }
  
//   // Run the function
//   main();