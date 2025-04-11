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
//  const patientAddress1 = "addr_test1qqwkave5e46pelgysvg6mx0st5zhte7gn79srscs8wv2qp5qkfvca3f7kpx3v3rssm4j97f63v5whrj8yvsx6dac9xrqyqqef6";
  const blockchainProvider = new BlockfrostProvider("preprod2DQWsQjqnzLW9swoBQujfKBIFyYILBiL");
  async function sendPortfolio(wallet: any, assets: any, patientAddress: string, cash: number ){
    try{
        const {utxos, walletAddress, collateral} = await getWalletInfoForTx(wallet);
        const {pubKeyHash: doctorPubKeyHash} = deserializeAddress(walletAddress);
        const {pubKeyHash: patientPubKeyHash} = deserializeAddress(patientAddress);
        //phần này cần cải thiện để lấy địa chỉ từ nft
        const datum = mConStr0([patientPubKeyHash, doctorPubKeyHash, cash]);
        const {scriptAddr, scriptCbor} = getScript();
      console.log("Asset: ", assets);
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
        const signTx = await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signTx);

        return txHash;
    }catch(error){
        throw error;
    }
  }
  

export default sendPortfolio;