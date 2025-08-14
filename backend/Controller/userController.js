const userSchema = require('../Models/userSchema');
const partnerSchema = require('../Models/partnerSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Generate Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// REGISTER USER
const createUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new userSchema({
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        const token = generateToken({ id: newUser._id, role: newUser.role });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // If delivery partner, also save in partner collection
        if (role === 'delivery_partner') {
            const newPartner = new partnerSchema({
                username,
                email,
                delivery_agent: newUser._id
            });
            await newPartner.save();
        }

        res.status(201).json({
            message: "User Created Successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role,
                token: token
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to Register User" });
    }
};

// LOGIN USER
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const userExist = await userSchema.findOne({ email });
        if (!userExist) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const isPasswordValid = await bcrypt.compare(password, userExist.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect Password" });
        }

        const token = generateToken(userExist);

        // Store token in HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: "Logged in Successfully",
            user: { id: userExist._id, username: userExist.username, role: userExist.role, token: token }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to Login" });
    }
};


// GET ALL USERS
const getAllUser = async (req, res) => {
    try {
        const allUser = await userSchema.find();
        res.status(200).json(allUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to Fetch Users" });
    }
};

// GET SINGLE USER
const getSingleUser = async (req, res) => {
    const { id } = req.params;
    try {
        const singleUser = await userSchema.findById(id);
        if (!singleUser) {
            return res.status(404).json({ message: "No Such User" });
        }
        res.status(200).json(singleUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to Fetch User Detail" });
    }
};

module.exports = { createUser, loginUser, getSingleUser, getAllUser };