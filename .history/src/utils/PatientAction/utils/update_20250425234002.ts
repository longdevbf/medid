import {
    Asset,
    deserializeAddress,
    deserializeDatum,
    mConStr0,
    MeshTxBuilder, 
   BrowserWallet
  } from "@meshsdk/core";
  import {
    blockchainProvider,
    getScript,
    getWalletInfoForTx,
  } from "../components/spend/common";
  async function updatePortfolio(wallet: BrowserWallet, doctorAddresses: string[], txHashLock: string){
    try{
        const {utxos, walletAddress, collateral} = await getWalletInfoForTx(wallet);
        const {pubKeyHash: userPubKeyHash} = deserializeAddress(walletAddress);
        const {scriptAddr, scriptCbor} = getScript();
        const utxoFetch = await blockchainProvider.fetchUTxOs(txHashLock);
       // console.log("utxo fetch : ", utxoFetch);
        const utxo = utxoFetch[0];
        const doctorPubKeyHashes = doctorAddresses.map((address) => {
            const { pubKeyHash } = deserializeAddress(address);
            return pubKeyHash;
          });
      
        const datum = deserializeDatum(utxo.output.plutusData!);
        const unitByte = datum.fields[2].bytes;
        const assets: Asset[]=[{
          unit: unitByte,
          quantity: "1",
        }]
        const newDatum = mConStr0([userPubKeyHash, doctorPubKeyHashes, unitByte]);   
        const txBuilder = new MeshTxBuilder({
            fetcher: blockchainProvider,
            submitter: blockchainProvider
        })
         //phần này cần xem lại ở smartcontract
        await txBuilder
        .spendingPlutusScriptV3()
        .txIn(
            utxo.input.txHash,
            utxo.input.outputIndex,
            utxo.output.amount,
            scriptAddr
        )
        .txInInlineDatumPresent()
        .txInRedeemerValue(mConStr0([]))
        .txInScript(scriptCbor)
        .txOut(walletAddress, [])
        .txInCollateral(
            collateral.input.txHash!,
            collateral.input.outputIndex!,
            collateral.output.amount!,
            collateral.output.address!,
        )
        .requiredSignerHash(userPubKeyHash)
        .txOut(scriptAddr, assets)
        .txOutInlineDatumValue(newDatum)
        .changeAddress(walletAddress)
        .selectUtxosFrom(utxos)
        .setNetwork("preprod")
        .complete();

       
        const unsignedTx = txBuilder.txHex;
        const signedTx =await wallet.signTx(unsignedTx, true);
        const txHash = await wallet.submitTx(signedTx);

        return txHash;

    }catch(error){
        throw error;
    }
  }
export default updatePortfolio;
  