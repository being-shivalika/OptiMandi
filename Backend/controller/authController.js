import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";


export const registerUser = async(req , res) =>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message: "Please provide all required fields"});
    }
    try{
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "user already exists"});
        }

        //hash password
        const passwordHash = await bcrypt.hash(password, 10);
        //create new user
        const newUser = new User({
            name,
            email,
            password: passwordHash

        });
        await newUser.save();

        //generate token
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.status(201).json({success: true, token, user: {id: newUser._id, name: newUser.name, email: newUser.email}});


    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
}

export const loginUser = async(req, res)=>{
    const {email, password } = req.body;
    try{
        //check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});

        }

        //compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        //generate token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.status(200).json({success: true, token, user: {id: user._id, name: user.name, email: user.email}});

        

    } catch (error) {
        console.error("loginUser error:", error);
        res.status(500).json({message: "Server error"});
    }
}