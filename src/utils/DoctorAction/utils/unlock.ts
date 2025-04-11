import {
    deserializeAddress,
    deserializeDatum,
    mConStr0,
    MeshTxBuilder,
  } from "@meshsdk/core";
  import {
    blockchainProvider,
    getScript,
    getWalletInfoForTx,

  } from "../components/spend/common";

  async function unlockAndPaymentPortfolio(wallet: any, txHashLock: string){
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
            "addr_test1qp32dhvj6nmhn8qjce8vsv3s0x70rrth7udxy32a7lm5yl7vchlp2ahqwyyfpv4l7fszccrngx2vcmmu5x3d3t3cy2uqpd7ewx",
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
  