import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { PinataSDK } from 'pinata';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Tạo thư mục tạm nếu không tồn tại
    const tempDir = path.join(process.cwd(), 'temp');
    try {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
    } catch (err) {
      console.error("Error creating temp directory:", err);
    }

    // Cấu hình formidable để lưu vào thư mục tạm
    const form = new IncomingForm({
      uploadDir: tempDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });
    
    // Parse form với Promise
    const formData = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Form parse error:", err);
          return reject(err);
        }
        
        // Debug chi tiết cấu trúc files
        console.log('Form parse completed, files structure:', 
          files ? Object.keys(files) : 'No files');
        
        resolve({ fields, files });
      });
    });
    
    // Debug cấu trúc dữ liệu
    console.log('FormData structure:', {
      hasFiles: !!formData.files,
      fileKeys: formData.files ? Object.keys(formData.files) : [],
    });
    
    // Tìm file trong dữ liệu từ formidable
    let file;
    if (formData.files && formData.files.file) {
      if (Array.isArray(formData.files.file)) {
        file = formData.files.file[0];
      } else {
        file = formData.files.file;
      }
    }
    else if (formData.files) {
      const fileKeys = Object.keys(formData.files);
      if (fileKeys.length > 0) {
        const firstKey = fileKeys[0];
        file = Array.isArray(formData.files[firstKey]) 
          ? formData.files[firstKey][0] 
          : formData.files[firstKey];
      }
    }
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Đường dẫn file
    const filePath = file.filepath || file.path;
    
    if (!filePath) {
      return res.status(500).json({ 
        error: 'Invalid file object - no filepath found',
        fileKeys: Object.keys(file) 
      });
    }

    // Pinata configuration
    const JWT = process.env.PINATA_JWT || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MzdkNzdiZC1kMWY2LTQyMWUtOGY2MC01OTgwZTMyOTdhOTEiLCJlbWFpbCI6Imxvbmd0ZC5hNWs0OGd0YkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZGNjYmY4MTA2ZDg1NjQzM2I1YWUiLCJzY29wZWRLZXlTZWNyZXQiOiIxZWM0YmE5YjQ3ZjllMjA1MzNlYTFiYmM5MjZkODIzOTJjZTcxODYyOWZjMmMwZWZjOTBjMWRiYjAxYTljN2IzIiwiZXhwIjoxNzc0NTI0MTMyfQ.IokET3UfMOUUe9EQaZ6y7iNOnJdKdu0rbzxeO0PKTSc";
    const pinataGateway = process.env.PINATA_GATEWAY || "emerald-managing-koala-687.mypinata.cloud";
    
    try {
      console.log("Initializing Pinata SDK...");
      const pinata = new PinataSDK({ 
        pinataJwt: JWT, 
        pinataGateway: pinataGateway 
      });

      const fileName = file.originalFilename || file.name || 'file';
      console.log(`Reading file: ${fileName}, path: ${filePath}`);
      
      // Đọc file thành buffer
      const fileBuffer = fs.readFileSync(filePath);
      console.log(`File read successfully, size: ${fileBuffer.length} bytes`);
      
      // QUAN TRỌNG: Sử dụng phương thức uploadByBlob thay vì file
      // Tùy thuộc vào phiên bản của Pinata SDK, chúng ta sẽ cần sử dụng một trong các phương pháp sau:
      
      // Phương pháp 1: Sử dụng pinFileToIPFS nếu SDK có hỗ trợ
      // let uploadResult;
      // if (typeof pinata.pinFileToIPFS === 'function') {
      //   uploadResult = await pinata.pinFileToIPFS({
      //     path: filePath,
      //     name: fileName
      //   });
      // }
      
      // Phương pháp 2: Cách tiếp cận an toàn nhất là sử dụng ReadableStream từ fs
      console.log("Uploading to Pinata using fs.createReadStream...");
      const fileStream = fs.createReadStream(filePath);
      
      const uploadResult = await pinata.upload.public.folder([
        {
          name: fileName,
          stream: fileStream
        }
      ]);
      
      // Nếu phương pháp trên không hoạt động, thử cách này:
      // console.log("Uploading to Pinata using buffer...");
      // const uploadResult = await pinata.upload.public.file({
      //   data: fileBuffer,
      //   name: fileName
      // });
      
      console.log("Upload successful, result:", uploadResult);
      const cid = uploadResult.cid || (uploadResult.IpfsHash ? uploadResult.IpfsHash : null);
      
      if (!cid) {
        console.error("No CID in upload result:", uploadResult);
        return res.status(500).json({
          error: 'Invalid response from Pinata',
          details: 'No CID returned'
        });
      }
      
      console.log("Upload successful, CID:", cid);
      
      // Xóa file tạm
      try {
        fs.unlinkSync(filePath);
        console.log(`Temporary file deleted: ${filePath}`);
      } catch (unlinkError) {
        console.error("Error deleting temporary file:", unlinkError);
      }
      
      return res.status(200).json({
        success: true,
        cid: cid,
        url: `https://${pinataGateway}/ipfs/${cid}`
      });
    } catch (pinataError) {
      console.error("Pinata error:", pinataError);
      return res.status(500).json({ 
        error: 'Pinata upload failed', 
        details: pinataError.message,
        stack: pinataError.stack
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ 
      error: 'Server error', 
      details: error.message,
      stack: error.stack
    });
  }
}