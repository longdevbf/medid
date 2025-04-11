import {
    Asset,
    BlockfrostProvider,
    deserializeAddress,
    mConStr0,
    MeshTxBuilder
  } from "@meshsdk/core";
  import {
    getScript,
    getWalletInfoForTx,
  } from "../components/spend/common";
  const blockchainProvider = new BlockfrostProvider("preprod2DQWsQjqnzLW9swoBQujfKBIFyYILBiL");
  export async function lockPortfolio(wallet: any, assets: any, doctorAddresses: string[], unit: string){
    try{
      
        const {utxos, walletAddress, collateral} = await getWalletInfoForTx(wallet);
        const {pubKeyHash: patientPubKeyHash} = deserializeAddress(walletAddress);
        const doctorPubKeyHashes = doctorAddresses.map((address) => {
            const { pubKeyHash } = deserializeAddress(address);
            return pubKeyHash;
          });      

        const datum = mConStr0([patientPubKeyHash, doctorPubKeyHashes, unit]);
        const {scriptAddr, scriptCbor} = getScript();
        const txBuilder = new MeshTxBuilder({
            fetcher: blockchainProvider,
            submitter: blockchainProvider,
          });
        await txBuilder
        .spendingPlutusScriptV3()
        .txOut(scriptAddr, assets)
        .txOutInlineDatumValue(datum)
        .changeAddress(walletAddress)
        .selectUtxosFrom(utxos)
        .setNetwork("preprod")
        .complete();

        const unsignedTx = txBuilder.txHex;
        const signTx =await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signTx);
        return txHash;
    }catch(error){
        throw error;
    }
  }
  
  export default lockPortfolio;

