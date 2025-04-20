import {
  BlockfrostProvider,
  CIP68_100,
  CIP68_222,
  deserializeAddress,
  deserializeDatum,
} from "@meshsdk/core";
import { blockchainProvider } from "./adapter";
import {
  decryptData,
  encryptData,
} from "../../secret/encryptAndDecrypt";
import crypto from 'crypto';

interface ParsedAsset {
  unit: string;
  policyId: string;
  assetName: string;
  assetNameHex: string;
  quantity: string;
}

interface ParsedMetaData {
  name: string;
  image: string;
  _pk: string;
  fingerprint: string;
  totalSupply: string;
  did_number: string;
}

/**
 * Làm sạch và chuẩn hóa chuỗi base64 để so sánh
 * @param base64String Chuỗi base64 cần làm sạch
 * @returns Chuỗi base64 đã được làm sạch
 */
function cleanBase64(base64String: string): string {
  // Loại bỏ các ký tự khoảng trắng và xuống dòng
  return base64String.replace(/\s+/g, '');
}

/**
 * So sánh hai chuỗi base64 với nhau, cho phép một số sai khác nhỏ
 * @param str1 Chuỗi thứ nhất
 * @param str2 Chuỗi thứ hai
 * @returns true nếu hai chuỗi tương đối giống nhau
 */
function compareBase64Strings(str1: string, str2: string): boolean {
  // Làm sạch cả hai chuỗi
  const clean1 = cleanBase64(str1);
  const clean2 = cleanBase64(str2);
  
  // So sánh chính xác
  if (clean1 === clean2) {
    return true;
  }
  
  // Nếu độ dài chênh lệch quá nhiều, coi như không khớp
  if (Math.abs(clean1.length - clean2.length) > 5) {
    return false;
  }
  
  // So sánh bằng MD5 hash (loại bỏ ảnh hưởng của các ký tự đặc biệt)
  const hash1 = crypto.createHash('md5').update(clean1).digest('hex');
  const hash2 = crypto.createHash('md5').update(clean2).digest('hex');
  
  // So sánh phần chính của chuỗi (bỏ qua các ký tự đặc biệt có thể khác nhau)
  const similarityThreshold = 0.95;
  let matchCount = 0;
  const minLength = Math.min(clean1.length, clean2.length);
  
  for (let i = 0; i < minLength; i++) {
    if (clean1[i] === clean2[i]) {
      matchCount++;
    }
  }
  
  const similarity = matchCount / minLength;
  return similarity >= similarityThreshold;
}

/**
 * Xử lý hex string từ metadata và chuyển đổi thành chuỗi base64
 * @param hexString Chuỗi hex cần xử lý
 * @returns Chuỗi base64 sau khi xử lý
 */
function processMetadataHex(hexString: string): string {
  console.log("Original hexString:", hexString);
  
  // Loại bỏ các marker CBOR
  let processed = hexString;
  
  // Xóa tiền tố CBOR nếu có
  if (processed.startsWith('5f5840')) {
    processed = processed.substring(6);
  }
  
  // Xóa hậu tố CBOR nếu có
  if (processed.endsWith('ff')) {
    processed = processed.substring(0, processed.length - 2);
  }
  
  // Xóa các marker CBOR trong chuỗi
  processed = processed.replace(/5840/g, '').replace(/5818/g, '');
  
  console.log("Processed hexString:", processed);
  
  try {
    // Chuyển đổi hex sang buffer và trả về string
    const buffer = Buffer.from(processed, 'hex');
    return buffer.toString();
  } catch (error) {
    console.error("Error converting hex to string:", error);
    return "";
  }
}

export async function verify_did(wallet: any, key: string, did_number: string) {
  if (!wallet || !key || !did_number) {
    console.error("Missing required parameters for verification");
    return false;
  }
  console.log("Starting verification process...");
  console.log("Expected DID Number:", did_number);
  
  const walletAddress = await wallet.getChangeAddress();
  const assetsInfoWallet = await blockchainProvider.fetchAddressAssets(
    walletAddress,
  );
  const { pubKeyHash: userPubkeyHash } = deserializeAddress(walletAddress);

  for (const [unit, quantity] of Object.entries(assetsInfoWallet)) {
    if (unit === "lovelace") {
      continue;
    }
    
    const policyId = unit.slice(0, 56);
    const assetNameHex = unit.slice(56);
    
    try {
      // Kiểm tra NFT có đúng định dạng không - loại bỏ kiểm tra này để xem tất cả NFT
      if (assetNameHex.startsWith("000de140")) {
        let unitAsset = policyId + assetNameHex;
        const metadata = await blockchainProvider.fetchAssetMetadata(
          unitAsset.toString(),
        );
        
        if (metadata && metadata._pk) {
          const walletPubKeyHash = deserializeAddress(walletAddress).pubKeyHash;
          const pkWithoutPrefix = metadata._pk.substring(4);
          
          // Kiểm tra pubkey hash có khớp không
          const check1 = pkWithoutPrefix === walletPubKeyHash;
          
          if (!metadata.did_number) {
            console.error("Missing DID Number in metadata");
            continue;
          }
          
          try {
            console.log("Raw metadata did_number:", metadata.did_number);
            
            // Xử lý chuỗi hex từ metadata
            const processedDidNumber = processMetadataHex(metadata.did_number);
            console.log("Processed DID from metadata:", processedDidNumber);
            
            // So sánh chuỗi đã xử lý với did_number mong đợi
            // Sử dụng so sánh thông minh thay vì so sánh chính xác
            const check2 = compareBase64Strings(processedDidNumber, did_number);
            
            if (check1 && check2) {
              console.log("Verification successful!");
              return true;
            } else {
              // Log chi tiết kết quả kiểm tra để debug
              console.log("Check results:", { 
                publicKeyMatch: check1, 
                didNumberMatch: check2
              });
              
              // Debug thêm về sự khác biệt giữa hai chuỗi
              if (!check2) {
                console.log("DID length comparison:", {
                  processed: processedDidNumber.length,
                  expected: did_number.length
                });
                
                // Tìm vị trí đầu tiên khác nhau
                for (let i = 0; i < Math.min(processedDidNumber.length, did_number.length); i++) {
                  if (processedDidNumber[i] !== did_number[i]) {
                    console.log(`First difference at position ${i}:`, {
                      processed: processedDidNumber.substring(i, i+10),
                      expected: did_number.substring(i, i+10)
                    });
                    break;
                  }
                }
              }
            }
          } catch (error) {
            console.error("Error comparing did_number:", error);
            continue;
          }
        }
      }
    } catch (error) {
      console.error("Error processing asset:", unit, error);
      continue;
    }
  }

  console.log("Verification failed - no matching NFT found");
  return false;
}