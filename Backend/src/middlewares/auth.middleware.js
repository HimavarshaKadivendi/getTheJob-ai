const jwt = require("jsonwebtoken"); // for verifying the token
const tokenBlacklistModel = require('../models/blacklist.model');

async function authUser(req, res, next) {

    const token = req.cookies.token; // get the token from the cookie
    if(!token) {
        return res.status(401).json({message: "Token not provided, Unauthorized"});
    }

    // check if the token is blacklisted or not
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token });

    if(isTokenBlacklisted) {
        return res.status(401).json({message: "Token is invalid"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded; // attach the decoded user info to the request object
        next(); // proceed to the next middleware or route handler

    } catch(err) {
        return res.status(401).json({message: "Invalid token"});
    }
    
}

module.exports = { authUser };