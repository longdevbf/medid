import {
    deserializeAddress,
    mConStr0,
    MeshTxBuilder,
    BrowserWallet    
  } from "@meshsdk/core";
  import {
    blockchainProvider,
    getScript,
    getWalletInfoForTx,
  } from "../components/spend/common";

  const unlockPortfolio = async (wallet: BrowserWallet, txHashLock: string) => {
    try {
        // Kiểm tra txHash hợp lệ
        if (!txHashLock) {
            throw new Error("Transaction hash is required for unlocking");
        }
        
        console.log("Unlock called with txHash:", txHashLock);
        console.log("Unlocking portfolio...");
        const {utxos, walletAddress, collateral} = await getWalletInfoForTx(wallet);
        const {pubKeyHash: userPubKeyHash} = deserializeAddress(walletAddress);     
        const {scriptAddr, scriptCbor} = getScript(); 
        const utxoFetch = await blockchainProvider.fetchUTxOs(txHashLock);
        const plutusDataUtxo = utxoFetch.find(utxo => utxo.output.plutusData);
        let index = 0;
        if (plutusDataUtxo) {
            index = plutusDataUtxo.input.outputIndex;
        } else {
            throw new Error("No Plutus data found in the UTXOs");
        }
        

        



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
export default unlockPortfolio;
