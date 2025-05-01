import CryptoJS from "crypto-js";

function encryptShort(data: string, key: string): string {
  const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64); // Hoặc enc.Hex nếu bạn muốn rút gọn nữa
}

function decryptShort(encryptedBase64: string, key: string): string {
  const decrypted = CryptoJS.AES.decrypt(
    CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(encryptedBase64)
    }),
    CryptoJS.enc.Utf8.parse(key),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
}


async function main(){
    const data = "Xin chao ca the gioi hahahahahahahahahahahaha";
    const key = "12345678901234567890123456789012"; // 32 bytes key
    
    const encrypted = await encryptShort(data, key);
    console.log("Encrypted:", encrypted);
    const decrypted = await decryptShort(encrypted, key);
    console.log("Decrypted:", decrypted);
}
main();