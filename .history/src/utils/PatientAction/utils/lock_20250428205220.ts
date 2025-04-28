import {
    Asset,
    BlockfrostProvider,
    deserializeAddress,
    mConStr0,
    MeshTxBuilder,
    BrowserWallet
} from "@meshsdk/core";
import {
    getScript,
    getWalletInfoForTx,
} from "./common";

const blockchainProvider = new BlockfrostProvider("preprod2DQWsQjqnzLW9swoBQujfKBIFyYILBiL");

// Hardcoded pubKeyHash để tránh lỗi deserializeAddress


export async function lockPortfolio(wallet: BrowserWallet, assets: Asset[], doctorAddresses: string[], unit: string) {
    try {
        const {utxos, walletAddress} = await getWalletInfoForTx(wallet);
        const {pubKeyHash: patientPubKeyHash} = deserializeAddress(walletAddress);
        
        // Thêm kiểm tra và xử lý lỗi cho từng địa chỉ
        const doctorPubKeyHashes = [];
        for (const address of doctorAddresses) {
            try {
                // Kiểm tra định dạng địa chỉ cơ bản
                if (!address || typeof address !== 'string' || !address.startsWith('addr')) {
                    console.warn(`Invalid address format: ${address}`);
                    throw new Error(`Địa chỉ không hợp lệ: ${address}`);
                }
                
                // Sử dụng hàm trích xuất pubKeyHash tạm thời thay vì deserializeAddress
                const pubKeyHash = deserializeAddress(address).pubKeyHash;
                
                // Kiểm tra pubKeyHash cơ bản
                if (!pubKeyHash || pubKeyHash.length < 10) {
                    throw new Error(`Không thể tạo pubKeyHash từ địa chỉ: ${address}`);
                }
                
                doctorPubKeyHashes.push(pubKeyHash);
                console.log(`Added pubKeyHash for address ${address}: ${pubKeyHash}`);
            } catch (err) {
                console.error(`Error processing address ${address}:`, err);
                throw new Error(`Không thể xử lý địa chỉ: ${address.substring(0, 15)}... - ${err || 'Lỗi không xác định'}`);
            }
        }
        
        if (doctorPubKeyHashes.length === 0) {
            throw new Error('Không tìm thấy pubKeyHash hợp lệ từ các địa chỉ bác sĩ');
        }

        const datum = mConStr0([patientPubKeyHash, doctorPubKeyHashes, unit]);
        const {scriptAddr} = getScript();
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
    } catch (error) {
        console.error("Error in lockPortfolio:", error);
        throw error;
    }
}

export default lockPortfolio;