import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { PinataSDK } from 'pinata';

export const config = {
  api: {
    bodyParser: false, // Disabling body parser for file uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form' });
      }

      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Pinata configuration
      const JWT = process.env.PINATA_JWT || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmY2IwNjMyNS00MWQ1LTQyNmUtYjdlYS1lOTdhY2ZlNTJjYTciLCJlbWFpbCI6ImxvbmdzcGVlZDAwMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOGVkZDI0MGY5N2U5NTQ4OGM1NmUiLCJzY29wZWRLZXlTZWNyZXQiOiIwN2FmZGFlYTg4ODYzZmU1NjU0NTA3MzE2ZDM2YTFjMDU5ODU5OWYxY2QwMTFiNmY3MDQ5M2JjOTBmNzE5NGY2IiwiZXhwIjoxNzc3Njk1MjE3fQ.b63z7hPnKwoapT";
      const pinataGateway = process.env.PINATA_GATEWAY || "lime-voluntary-hawk-180.mypinata.cloud";
      
      const pinata = new PinataSDK({ 
        pinataJwt: JWT, 
        pinataGateway: pinataGateway 
      });

      try {
        // Read file from temporary location
        const fileData = fs.readFileSync(file.filepath);
        
        // Create a file object that Pinata can use
        const pinataFile = {
          data: fileData,
          name: file.originalFilename || 'file'
        };
        
        // Upload to Pinata
        const uploadResult = await pinata.upload.public.file(pinataFile);
        
        return res.status(200).json({
          success: true,
          cid: uploadResult.cid,
          url: `https://${pinataGateway}/ipfs/${uploadResult.cid}`
        });
      } catch (pinataError) {
        console.error("Pinata error:", pinataError);
        return res.status(500).json({ 
          error: 'Pinata upload failed', 
          details: pinataError.message 
        });
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: 'Server error' });
  }
}