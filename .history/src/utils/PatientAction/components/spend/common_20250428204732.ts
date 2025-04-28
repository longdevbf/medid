import {
    BlockfrostProvider,
    MeshTxBuilder,
    BrowserWallet,
    serializePlutusScript,
    UTxO

  } from "@meshsdk/core";
  import { applyParamsToScript } from "@meshsdk/core-csl";
  import plutus from '../../../../../smart_contract/plutus.json';

   
  export const blockchainProvider = new BlockfrostProvider("preprod2DQWsQjqnzLW9swoBQujfKBIFyYILBiL");
  function readValidator(title: string): string {
    const validator = plutus.validators.find(v => v.title === title);
    if (!validator) throw new Error(`${title} validator not found.`);
    return validator.compiledCode;
  }
  export function getScript() {
    const patientActionCompiledCode = readValidator("patientaction.action1.spend");
    const scriptCbor = applyParamsToScript(
      patientActionCompiledCode,
      []
    );
    const  PatientScript = {
      code: scriptCbor,
      version: "V3" as const,
    };
    const scriptAddr = 

   
    return { scriptCbor, scriptAddr };
  }
  
  // reusable function to get a transaction builder
  export function getTxBuilder() {
    return new MeshTxBuilder({
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
      verbose:true,
    });
  }
   
  // reusable function to get a UTxO by transaction hash
  export async function getUtxoByTxHash(txHash: string): Promise<UTxO> {
    const utxos = await blockchainProvider.fetchUTxOs(txHash);
    if (utxos.length === 0) {
      throw new Error("UTxO not found");
    }
    return utxos[0];
  }
   
  export async function getWalletInfoForTx(wallet : BrowserWallet) {
    const utxos = await wallet.getUtxos();
    const walletAddress = (await wallet.getUsedAddresses())[0];
    const collateral = (await wallet.getCollateral())[0];
    return { utxos, walletAddress, collateral };
  }
  export async function getUtxoForTx(address: string, txHash: string){
    const utxos: UTxO[] = await blockchainProvider.fetchAddressUTxOs(address);
    const utxo = utxos.find(function (utxo: UTxO) {
      return utxo.input.txHash === txHash;
    });
  
    if (!utxo) throw new Error("No UTXOs found in getUtxoForTx method.");
    return utxo;
  }
  
  export async function getAddressUTXOAsset(address: string, unit: string)  {
    const utxos = await blockchainProvider.fetchAddressUTxOs(address, unit);
    return utxos[utxos.length - 1];
  };