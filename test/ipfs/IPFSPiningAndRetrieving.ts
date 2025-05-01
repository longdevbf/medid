import { PinataSDK } from "pinata";
import "dotenv/config";

const pinata = new PinataSDK({
  pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MzdkNzd" + 
    "iZC1kMWY2LTQyMWUtOGY2MC01OTgwZTMyOTdhOTEiLCJlbWFpbCI6Imxvbmd0ZC5hNWs0OGd0YkBnbWF" + 
    "pbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXN" + 
    "pcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3V" + 
    "udCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXM" + 
    "iOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5Ijo" + 
    "iZGNjYmY4MTA2ZDg1NjQzM2I1YWUiLCJzY29wZWRLZXlTZWNyZXQiOiIxZWM0YmE5YjQ3ZjllMjA1MzN" + 
    "lYTFiYmM5MjZkODIzOTJjZTcxODYyOWZjMmMwZWZjOTBjMWRiYjAxYTljN2IzIiwiZXhwIjoxNzc0NTI" + 
    "0MTMyfQ.IokET3UfMOUUe9EQaZ6y7iNOnJdKdu0rbzxeO0PKTSc",
  pinataGateway: "emerald-managing-koala-687.mypinata.cloud"
});

async function uploadToIPFS(encryptedResourceData: string, resourceType: string) {
  try {
    const file = new File([`${encryptedResourceData}`], `${resourceType}Hash.txt`, {
      type: "text/plain",
    });
    const upload = await pinata.upload.public.file(file);
    const url = upload.cid;
    return url;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to upload to IPFS");
  }
}

async function retrieveFromIPFS(signedURL: string) {
  try {
    const response = await fetch(`${signedURL}`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    const retrievedData = await response.text();
    return retrievedData;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to retrieve data from IPFS");
  }
}

const uploadImageToIPFS = async (file: File) => {
  try {
    const upload = await pinata.upload.public.file(file);
    const url = upload.cid;
    return url;
  } catch (error) {
    console.error("Error uploading image to IPFS:", error);
    throw new Error("Failed to upload image to IPFS");
  }
};

// Main function to upload both image and text data
const main = async () => {
  // Simulate the user input
  const patientInfo = {
    name: "Nguyen Van A",
    age: 32,
    diagnosis: "Healthy",
  };
  const imageFile = new File(["../../th (1).jpg"], "image.jpg", { type: "image/jpeg" });

  try {
    // Step 1: Upload text data (patient info) to IPFS
    const encryptedData = JSON.stringify(patientInfo);
    const textCid = await uploadToIPFS(encryptedData, "patientInfo");

    // Step 2: Upload image to IPFS
    const imageCid = await uploadImageToIPFS(imageFile);

    // Step 3: Combine the CIDs into one object (could be stored as a JSON or any format you prefer)
    const combinedData = {
      textCid: textCid,
      imageCid: imageCid,
    };

    // You can store combinedData somewhere, or just return a combined CID:
    console.log("Uploaded CIDs:", combinedData);

    // Step 4: Retrieve data from IPFS
    const textData = await retrieveFromIPFS(`https://gateway.pinata.cloud/ipfs/${textCid}`);
    console.log("Retrieved text data:", textData);

    // You would also need to retrieve image data if required
    // const imageData = await retrieveFromIPFS(`https://gateway.pinata.cloud/ipfs/${imageCid}`);
    // Do something with imageData if needed

  } catch (error) {
    console.error("Error during the upload process:", error);
  }
};

main();
