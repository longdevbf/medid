import {
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

  } from "../common";

  async function unlockAndPaymentPortfolio(wallet: BrowserWallet, txHashLock: string){
    try{
        const {utxos, walletAddress, collateral} = await getWalletInfoForTx(wallet);
        const {pubKeyHash: userPubKeyHash} = deserializeAddress(walletAddress);
        const {scriptAddr, scriptCbor} = getScript();
        const utxoFetch = await blockchainProvider.fetchUTxOs(txHashLock);
        const utxo = utxoFetch[0];
        const datum = deserializeDatum(utxo.output.plutusData!);
        const ada_require = datum.fields[2].int;
        const cash_paid = (ada_require*1000000).toString();
        const txBuilder = new MeshTxBuilder({
            fetcher: blockchainProvider,
            submitter: blockchainProvider
        })
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
        .changeAddress(walletAddress)
        .txInScript(scriptCbor)
        .txOut(walletAddress, [])
        .txOut(
            "addr_test1qqfclu8wed43pauu6q05azc6auphe4unrl2d5y3pxnsrkwkvfk5ezmmvdr6k6aw64htqz2wsws72q7x4m9ldv3aqklyq93fupj",
            [{
                unit: "lovelace",
                quantity: cash_paid,
            }]
        )//phần này cần cải thiện
        .txInCollateral(
            collateral.input.txHash!,
            collateral.input.outputIndex!,
            collateral.output.amount!,
            collateral.output.address!,
        )
        .requiredSignerHash(userPubKeyHash)
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
export default unlockAndPaymentPortfolio;
  