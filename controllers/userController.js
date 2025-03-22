const User = require('../models/Users');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {Types} = require("mongoose");
const {validationResult} = require("express-validator");
require('dotenv').config();

const createUser = async (req, res) => {
    const { name, age, password, email } = req.body;

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "A user with this email already exists." });
        }
        const user = new User({password,name,age,email});

        const result = await user.save();

        res.status(201).json({ message: "User created", user: result });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(400).json({ message: err.message });
    }
};


const changePassword = async (req, res) => {
    const {password, newPassword} = req.body;
    const userId = req.params.id;

    try{
        if (!Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        // const errors = validationResult(req)
        // if (!errors.isEmpty()) {
        //     return res.status(400).json({ errors: errors.array() });
        // }

        if (!password || !newPassword) {
            return res.status(400).json({ message: "Both currentPassword and newPassword are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const isPasswordValid = await bcrypt.compare(password, artist.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: "User updated", user: user });
    }catch(err) {
        console.error("Error changing password:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email: email})
        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        //create token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({ message: "User successfully logged in", user: user, token: token });
    }catch(err){
        console.error("Error login user:", err);
        res.status(500).json({ message: err.message });
    }
}

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ message: "Users retrieved", users: users });
    } catch (err) {
        console.error("Error retrieving users:", err);
        res.status(500).json({ message: err.message });
    }
};


const getUserById = async (req, res) => {
    try {
        const {id} = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({user: user});
    } catch (err) {
        console.error("Error retrieving user:", err);
        res.status(500).json({ message: err.message });
    }
};


const updateUser = async (req, res) => {
    try {

        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated", user:user });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(400).json({ message: err.message });
    }
};





const deleteProfileImage = async (req, res) => {
    const artistId = req.params.id;

    try {
        if (!Types.ObjectId.isValid(artistId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        if (artist.profileImage) {
            const imagePath = path.join(__dirname, '../', artist.profileImage);

            // Delete the image file
            fs.unlink(imagePath, async (err) => {
                if (err) {
                    console.error('Error deleting image:', err);
                    return res.status(500).json({ message: "Error deleting image from server" });
                }

                // Clear the profileImage field in the artist document
                artist.profileImage = undefined;
                const updatedArtist = await artist.save();


                return res.status(200).json({
                    message: "Profile image deleted successfully",
                    user: updatedArtist,
                });
            });
        } else {
            return res.status(404).json({ message: "No profile image to delete" });
        }
    } catch (err) {
        console.error('Error deleting image:', err);
        res.status(500).json({ message: "Internal server error" });
    }
};



const deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        if (!Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = {
    createUser,
    loginUser,
    getUsers,
    updateUser,
    deleteUser
};
