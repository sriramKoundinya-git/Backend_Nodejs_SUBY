const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
  try {
    console.log(req.body);

    const { firmName, area, category, region, offer } = req.body;
    const image = req.file ? req.file.filename : 'default-firm-placeholder.jpg';

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
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
    vendor.firm.push(savedFirm._id);
    await vendor.save();

    return res.status(200).json({ message: 'Firm added successfully', firm: savedFirm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteFirmById = async (req,res) => {
  try {
    const firmId = req.params.firmId

    const deletedFirm = await Product.findByIdAndDelete(firmId);

    if(!deletedFirm){
      return res.status(400).json({error:"No product found"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting products" });
  }
}


module.exports = { addFirm, upload ,deleteFirmById };