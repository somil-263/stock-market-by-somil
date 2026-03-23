const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try{
        const {name, username, email, password} = req.body;

        const userExist = await User.findOne({where: {email}});
        if(userExist){
            return res.status(400).json({message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            username,
            email,
            password: hashedPassword
        })

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

const loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;
        
        if(!email || !password){
            return res.status(400).json({message: "Please provide email and password"});
        }

        const userFind = await User.findOne({where: {email}});

        if(!userFind) return res.status(400).json({message: "Invalid credentials"});

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

module.exports = {
    registerUser,
    loginUser
}