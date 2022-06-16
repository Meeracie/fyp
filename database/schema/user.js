const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: mongoose.SchemaTypes.String, required: true },
    discordId: { type: mongoose.SchemaTypes.String, required: true },
    reminder: { type: mongoose.SchemaTypes.String },
    // registeredAt: { type: Number, default: Date.now() },
});

module.exports = mongoose.model("User", userSchema);
