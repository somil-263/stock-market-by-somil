const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const validator = require('validator');

const registerUser = async (req, res) => {
    try{
        const {name, username, email, password} = req.body;

        if(!name || !username || !email || !password){
            return res.status(400).json({message: "Please provide all fields"});
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({message: "Please provide a valid email"});
        }

        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const usernameExists = await User.findOne({ where: { username } });
        if (usernameExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            otp: generatedOtp
        })

        const emailMessage = `Welcome to Empire Trading, ${name}!\n\nUse This Otp for Verify the Account: ${generatedOtp}\n\nDon't share this OTP with anyone!`;
        sendEmail(newUser.email, emailMessage).catch(err => console.log("Email error in background:", err));

        res.status(201).json({
            message: "User registered successfully",
            user:{
                id: newUser.id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email
            }
        })
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const verifyOTP = async (req, res) => {
    try{
        const {email, otp} = req.body;
        
        if(!email || !otp){
            return res.status(400).json({message: "Please provide email and otp"});
        }

        const userFind = await User.findOne({where: {email}});
        
        if(!userFind) return res.status(400).json({message: "Invalid credentials"});

        if(userFind.otp !== otp) return res.status(400).json({message: "Invalid otp"});

        userFind.isVerified = true;
        await userFind.save();

        const token = jwt.sign({ id: userFind.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(200).json({
            message: "User verified successfully",
            user:{
                id: userFind.id,
                name: userFind.name,
                username: userFind.username,
                email: userFind.email,
                isVerified: userFind.isVerified
            }
        });
    }catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        
        if(!email || !password){
            return res.status(400).json({message: "Please provide email and password"});
        }

        const userFind = await User.findOne({where: {email}});

        if(!userFind) return res.status(400).json({message: "Invalid credentials"});

        if (!userFind.isVerified) {
            return res.status(401).json({ message: "Bhai pehle email par aaya hua OTP verify kar!" });
        }

        const isMatch = await bcrypt.compare(password, userFind.password);
        if(!isMatch) return res.status(400).json({message: "Invalid credentials"});

        const token = jwt.sign(
            {id: userFind.id}, 
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user:{
                id: userFind.id,
                username: userFind.username,
                balance: userFind.balance
            }
        });

    }catch(error){
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
}

const getUserProfile = async (req, res) => {
    try{
        const user = await User.findByPk(req.user.id, {
            attributes: {exclude: ['password']}
        })

        if(!user){
            return res.status(404).json({ error : "User not Found" })
        }

        res.status(200).json({
            message: "Welcome To Your Profile Dashboard",
            profile : user
        })

    }
    catch(error){
        res.status(500).json({ error : "Server Error!", details: error.message});
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User is not logged in" });
        }

        const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.otp = resetOtp; 
        await user.save();

        sendEmail(email, resetOtp).catch(err => console.log("Reset Email Error:", err));

        res.status(200).json({ message: "OTP sent to your email!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP!" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.otp = null;
        await user.save();

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Password reset failed." });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    verifyOTP,
    forgotPassword,
    resetPassword
}