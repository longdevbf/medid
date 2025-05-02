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
    console.log("1");
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
        resolve({ fields, files });
      });
    });
    
    // Debug cấu trúc dữ liệu
    console.log('FormData structure:', {
      hasFiles: !!formData.files,
      fileKeys: formData.files ? Object.keys(formData.files) : [],
    });
    
    // Xác định file từ formData
    let file;
    if (formData.files && formData.files.file) {
      if (Array.isArray(formData.files.file)) {
        file = formData.files.file[0];
      } else {
        file = formData.files.file;
      }
    }
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Debug thông tin file
    console.log('File info:', {
      keys: Object.keys(file),
      size: file.size,
      name: file.originalFilename || file.name,
      path: file.filepath || file.path,
    });
    
    // Đường dẫn file
    const filePath = file.filepath || file.path;
    
    if (!filePath) {
      return res.status(500).json({ 
        error: 'Invalid file object - no filepath found',
        fileKeys: Object.keys(file) 
      });
    }

    // Kiểm tra file có tồn tại không
    try {
      const stats = fs.statSync(filePath);
      console.log(`File exists: ${stats.isFile()}, Size: ${stats.size} bytes`);
      if (!stats.isFile() || stats.size === 0) {
        return res.status(500).json({ error: 'File is not valid or empty' });
      }
    } catch (statError) {
      console.error("File stat error:", statError);
      return res.status(500).json({ 
        error: 'File does not exist', 
        details: statError.message 
      });
    }

    // Pinata configuration
    const JWT = process.env.PINATA_JWT || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmY2IwNjMyNS00MWQ1LTQyNmUtYjdlYS1lOTdhY2ZlNTJjYTciLCJlbWFpbCI6ImxvbmdzcGVlZDAwMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOGVkZDI0MGY5N2U5NTQ4OGM1NmUiLCJzY29wZWRLZXlTZWNyZXQiOiIwN2FmZGFlYTg4ODYzZmU1NjU0NTA3MzE2ZDM2YTFjMDU5ODU5OWYxY2QwMTFiNmY3MDQ5M2JjOTBmNzE5NGY2IiwiZXhwIjoxNzc3Njk1MjE3fQ.b63z7hPnKwoapT";
    const pinataGateway = process.env.PINATA_GATEWAY || "lime-voluntary-hawk-180.mypinata.cloud";
    
    try {
      console.log("Initializing Pinata SDK...");
      const pinata = new PinataSDK({ 
        pinataJwt: JWT, 
        pinataGateway: pinataGateway 
      });

      const fileName = file.originalFilename || file.name || 'file';
      console.log(`Reading file: ${fileName}, path: ${filePath}`);
      
      // Đọc file
      const fileBuffer = fs.readFileSync(filePath);
      console.log(`File read successfully, size: ${fileBuffer.length} bytes`);
      
      // Tạo object cho Pinata
      const pinataFile = {
        data: fileBuffer,
        name: fileName
      };
      
      // Upload lên Pinata
      console.log("Uploading to Pinata...");
      const uploadResult = await pinata.upload.public.file(pinataFile);
      console.log("Upload successful, CID:", uploadResult.cid);
      
      // Xóa file tạm
      try {
        fs.unlinkSync(filePath);
        console.log(`Temporary file deleted: ${filePath}`);
      } catch (unlinkError) {
        console.error("Error deleting temporary file:", unlinkError);
        // Không return lỗi vì upload đã thành công
      }
      
      return res.status(200).json({
        success: true,
        cid: uploadResult.cid,
        url: `https://${pinataGateway}/ipfs/${uploadResult.cid}`
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