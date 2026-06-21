const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to be added in the blacklist"],
    },
}, {
    timestamps: true, // token is blaclisted now, so we can set an expiry time for it, after which it will be removed from the blacklist
});

// create a model for the blacklist tokens
const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema);

module.exports = tokenBlacklistModel;
