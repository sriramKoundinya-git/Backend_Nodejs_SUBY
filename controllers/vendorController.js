const Vendor= require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotEnv = require('dotenv');
dotEnv.config();
const secretKey = process.env.WhatIsYourName


const vendorRegister = async (req,resp) => {
const { userName, email, password } = req.body; 
try{
const vendoEmail = await Vendor.findOne({ email });

if(vendoEmail){
    return resp.status(400).json("Email already exists"); 
}
const hashedPassword = await bcrypt.hash(password,10);

const newVendor = new Vendor({
    userName,
    email,
    password: hashedPassword
});
await newVendor.save();
resp.status(201).json( {message:"Vendor registered successfully"} );
console.log("Registered successfully");

} catch(error){
resp.status(500).json({error: "Server error"} );
console.error("Error during vendor registration:", error);

}
}


const vendorLogin = async (req,res)=>{
    const { email, password } = req.body;
try{
    const vendor = await Vendor.findOne({ email });
    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

     const token = jwt.sign({vendorId: vendor._id}, secretKey, { expiresIn: '1h' }); 

    const vendorId = vendor._id;


    res.status(200).json({success:"Login successful", token: token ,vendorId});
    console.log({Status:"Logged In Successfully",Email_Id:email, token:token});
}
catch(error){
      console.log("Error during vendor login:", error);
      res.status(500).json({ error: 'Internal Server error' });
} 

}

const getAllVendors = async(req, res)=>{
try{
const vendors = await Vendor.find().populate('firm');
res.json({vendors})
} catch(error){
console.log(error);
res.status(500).json({error:"Internal server error"});
}
}


const getVendorById = async(req, res)=>{
const vendorId = req.params.id
try{
const vendor = await Vendor.findById(vendorId).populate('firm');
if(!vendor){
return res.status(404).json({error : 'Vendor not found'})
}
const vendorFermId = vendor.firm[0]._id;
res.status(200).json({vendorId,vendorFermId})
} catch(error){
console.log(error);
res.status(500).json({error:"Internal server error"});
}
}

module.exports =  {vendorRegister ,  vendorLogin, getAllVendors,getVendorById};