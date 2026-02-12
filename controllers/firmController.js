const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Add Firm
const addFirm = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { firmName, area, category, offer } = req.body;

    // Handle region (single string => array)
    let region = req.body.region || [];
    if (!Array.isArray(region)) region = [region];

    const image = req.file ? req.file.filename : 'default-firm-placeholder.jpg';

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    if(vendor.firm.length > 0){
      return res.status(400).json({message:"Vendor can have only one firm"});
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id
    });

    const savedFirm = await firm.save();
    const firmId = savedFirm._id 
    vendor.firm.push(savedFirm._id);
    await vendor.save();

    
    res.status(200).json({ message: 'Firm added successfully', firm: savedFirm , firmId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const deletedFirm = await Firm.findByIdAndDelete(firmId);

    if (!deletedFirm) return res.status(400).json({ error: "No firm found" });

    res.status(200).json({ message: "Firm deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting firm" });
  }
};

module.exports = { addFirm, upload, deleteFirmById };