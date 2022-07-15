const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: mongoose.SchemaTypes.String, required: true },
    discordId: { type: mongoose.SchemaTypes.String, required: true },
    reminder: { type: mongoose.SchemaTypes.String },
    reminderStop: { type: mongoose.SchemaTypes.Boolean },
    reminderOngoing: { type: mongoose.SchemaTypes.Boolean},
});

module.exports = mongoose.model("User", userSchema);
