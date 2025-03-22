const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const detailerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    ratings: [{
        rating:{
            type: Number,
            min: 1,
            max: 10,
        },
        userId: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    opinions: [{
        opinion: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        userId: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})
detailerSchema.pre('save', async function (next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})
const Detailer = mongoose.model('Detailer',detailerSchema,'detailers');
module.exports = Detailer;