const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
    {
        userName: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String},
        firm:[{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Firm'
        }]
    }
)

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;