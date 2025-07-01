import XLSX from 'xlsx';
import Item from '../models/Item.js';


const uploadExcel = async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Map and sanitize
    const items = data.map((row) => ({
      code: row.code,
      Description: row.Description,
      um: row.UM,
      price: parseFloat(row.price),
      qty: parseFloat(row.qty),
      total: parseFloat(row.total),
    }));

    await Item.insertMany(items);
    res.json({ success: true, message: 'Data uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

export { uploadExcel };
