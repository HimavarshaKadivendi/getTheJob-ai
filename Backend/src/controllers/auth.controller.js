const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require('../models/blacklist.model');

/**
 * @name registerUserController
 * @description Register a new user, expects username, email and password in the request body
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body;
    if(!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide username, email and password"
        });
    }
    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ username}, { email }]
    });
    if(isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this username or email already exists"
        });
    }

    // hash the password before saving to the database
    const hash = await bcrypt.hash(password, 10);
    const user = new userModel({
        username,
        email,
        password: hash,
    });

    await user.save(); // save to mongoDB

    // TOKEN creation 
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // token will expire in 1 day

    );

    // set this token in the COOKIE
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
            process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(201).json({message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });

}

/**
 * @name loginUserController
 * @description Login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if(!user) {
        return res.status(400).json({message: "Invalid email or password"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(400).json({message: "Invalid email or password"});
    }

    // TOKEN creation
    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } // token will expire in 1 day

    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
            process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
async function logoutUserController(req, res) {
    // console.log("Cookies:", req.cookies);

    const token = req.cookies.token;

    // console.log("Token:", token);

    if(token) {
        const result = await tokenBlacklistModel.create({ token });
        // console.log("Inserted:", result);
    }

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
            process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
    });

    res.status(200).json({
        message: "User logged out successfully"
    });
}

/**
 * @name getMeController
 * @description Get the current logged in user details, expects token in the cookie
 * @access Private
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id).select("-password"); // exclude password from the response

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}
module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
};