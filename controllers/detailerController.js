const Detailer = require('../models/Detailers');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {Types} = require('mongoose');
const {validationResult } = require('express-validator');
require('dotenv').config();

const createDetailerAccount = async (req, res) => {
    const {name,password,email} = req.body;

    try{
        const existingDetailer = await Detailer.findOne({email:email});
        if(existingDetailer){
            return res.status(400).send({message:'Email already exist'});
        }
        const detailer = new Detailer({name,password,email});
        const result = await detailer.save();
        res.status(201).json({ message: "Detailer created", user: result });
    }catch(err){
        console.error("Error creating detail:", err);
        res.status(400).json({ message: err.message });
    }
};

const loginDetailer = async (req, res) => {
    const {email, password} = req.body;

    try{
        const detailer = await Detailer.findOne({email:email})
        if(!detailer){
            return res.status(400).send({message:'Email does not exist'});
        }

        const isPasswordValid = await bcrypt.compare(password, detailer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({id:detailer._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({message: "User logged in", user: detailer, token: token });
    }catch(err){
        console.error("Error login user:", err);
        res.status(500).json({ message: err.message });
    }
};

const getDetailers = async (req, res) => {
    try{
        const detailers = await Detailer.find();
        res.status(200).json({message: "Detailers retrieved", users: detailers});
    }catch(err){
        console.error("Error retrieving details:", err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createDetailerAccount,
    loginDetailer,
    getDetailers
}