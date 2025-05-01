// Nếu chạy trong Node.js, bỏ comment dòng import sau và cài `node-fetch`
// import fetch from "node-fetch";

import CryptoJS from "crypto-js";

function encryptData(data: any, secretKey: string): string {
  if (!data) {
    console.error("Cannot encrypt empty or undefined data");
    return "";
  }

  const encrypted = CryptoJS.AES.encrypt(
    data,
    CryptoJS.enc.Utf8.parse(secretKey),
    {
      keySize: 128 / 8,
      iv: CryptoJS.enc.Utf8.parse(secretKey),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString();

  return encrypted;
}

function decryptData(encryptedData: any, secretKey: string): string {
  try {
    if (!encryptedData) {
      console.error("Cannot decrypt empty or undefined data");
      return "";
    }

    const decrypted = CryptoJS.AES.decrypt(
      encryptedData.toString(),
      CryptoJS.enc.Utf8.parse(secretKey),
      {
        keySize: 128 / 8,
        iv: CryptoJS.enc.Utf8.parse(secretKey),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const originalData = decrypted.toString(CryptoJS.enc.Utf8);
    return originalData;
  } catch (error) {
    console.error("Decryption error:", error);
    return "";
  }
}

function convertHexToString(hexString: string): string {
  let hex = hexString;
  if (hex.startsWith("5818")) {
    hex = hex.slice(4);
  }

  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }

  return String.fromCharCode(...bytes);
}

async function main() {
  const key = "0000000000000000";
  const dataEncrypted = "51xox1MRjygNt87TXVNid/ObRqMz4+UFDuy7gMM9vVtwQVAbdSv+cRI1u5TQ1aAUsNOuNaws3mZ9Nw1hdE0wxCdei/o4PMaHZWcfyn8jvI8Sy1Pc/EYCo3zIlngZnaQvY5ovDmh9W46rZkMKuC9oC4PrfglCb9z8BYMHb3GAHjBtdaqhxfDOzpY6x2RewyS7VjrCU+4v31exSA4YDskClW0RN+uPCR44nEGBhBck+oHTE5ceYKDozxyqbLTnFRc4IH38eju2fPM3sCG9h8Muf9TVLqEcXByzabL3kMP+ldFNUuNn33wYf8kT6zzToO6jTOYirTZfIkQEIerTFc+aE/KaJwglMxtiiHB+7GAeqgzJU3hrfqXPVe0mZHC9RFlY5EESaKiazR7DZX4LE7NpBkjNZoaUuJu5x0WRlPsIwVTKzhcKh1M/D6QfkfOrSuSIrA3ZHjIe+33yaBcqCl6E1qHzt5GILTZmQYDCgDRPtq+YX2EsEcB+l+b701su2psxxjak2d4p9uDfbgdIFqDLV7Wwivfm60RUivkbIu+M1jtx+y7fPFWeDOHdS4iXCfTOreiH9PlHm7SKp5YW8a0w2A8dZ6FqWU8bD8+mWC6OoawmFwV6NZVO7BgJgDNHQmuTff5D6P2XmaH9ELeDONVGISNpUoV7Gf4Iiexf6mLipxxRGAvx0KGPNOyTSyLMywhkhoDBaKBT5RHYLlL/Z1k0916L0OWxKbhw1eIF01WJ7QUsKRAlIrkplyid9mgM9TD0nhGe2bjW+E4I5bKCKfA7jXn0Spx7+OovG34VWuFv5R+KxKzres73u20CfEC9b0xa9dXQfTBUf7MHo8MSCMMWKFMm1Sdi9FTRQIO1e1DmRJUJ2zSHXCzelXiMkgVU4RCF2YnA0ke/1C/GB2FMit4VhvC+4loWjdgUhHxd9VFHTJTZc42GHAfrEpdkpfyydIb1Qc4iRMJgWmE5M/vHORdxHQD0rOaos1aYgrlWhE1oUC51sf90VluosZDkq9wGxePttxs2I0kfEQI5IKNbF3H4OeSH1jiU19ftQgd6slZAstvBKo6Hc0vu/wOerh2pXxFCnSBbcD7C2TIDxMJp8SKz6v3d5qtEVYN88s7yKalqPdsM72un6U9JxJHLnUW74gyqMSwBK/cr0PdfvCiZlqnbODxBD8WciwGJNLBhGPBnbEA=";

  // 1. Giải mã chuỗi
  const decrypted = decryptData(dataEncrypted, key);
  console.log("Decrypted string:", decrypted);

  // 2. Kiểm tra URL hợp lệ
  let url: URL;
  try {
    url = new URL(decrypted);
  } catch {
    console.error("Giá trị trả về không phải URL hợp lệ:", decrypted);
    return;
  }

  // 3. Fetch dữ liệu từ URL
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const jsonData = await response.json();
      console.log("JSON data fetched:", jsonData);
      // TODO: xử lý jsonData
    } else {
      const textData = await response.text();
      console.log("Text data fetched:", textData);
      // TODO: xử lý textData
    }
  } catch (fetchError) {
    console.error("Lỗi khi fetch dữ liệu:", fetchError);
  }
}

main().catch(console.error);
