const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: mongoose.SchemaTypes.String, required: true },
    discordId: { type: mongoose.SchemaTypes.String, required: true },
    reminder: { type: mongoose.SchemaTypes.String },
    stop: { type: mongoose.SchemaTypes.String },
    ongoing: { type: mongoose.SchemaTypes.String},
});

module.exports = mongoose.model("User", userSchema);
