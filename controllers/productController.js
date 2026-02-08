const Product = require('../models/Product');
const Firm = require('../models/Firm');
const multer = require('multer');
const path = require('path');
const { error } = require('console');


// MULTER STORAGE CONFIG
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


// ADD PRODUCT
const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestseller, description } = req.body;

    // image filename
    const image = req.file ? req.file.filename : "default.png";

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ error: "Firm not found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestseller,
      description,
      image,
      firm: firm._id
    });

   const savedProduct = await product.save();
   firm.products.push(savedProduct._id);
   const savedFirm = await firm.save();
    res.status(200).json({
      message: "Product added successfully",
     product: savedProduct,
    });

    console.log("Product added successfully",savedProduct);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// GET PRODUCTS BY FIRM
const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    console.log(firmId);
    
    const firm = await Firm.findById(firmId);
if(!firm){
return res.status(404).json({error:"No firm found"});
}
const products = await Product.find({firm:firmId});

    /*
    const products = await Product.find({ firm: firmId });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    
    console.log(restaurantName);
    */
   const restaurantName = firm.firmName
    res.status(200).json({restaurantName,products});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching products" });
  }
};

/* 

*/

const deleteProductById = async (req,res) => {
  try {
    const productId = req.params.productId

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if(!deletedProduct){
      return res.status(400).json({error:"No product found"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting products" });
  }
}
// EXPORTS
module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductByFirm,deleteProductById
};