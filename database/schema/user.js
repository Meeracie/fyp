const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: mongoose.SchemaTypes.String,
    discordId: { type: mongoose.SchemaTypes.String, required: true },
    // registeredAt: { type: Number, default: Date.now() },
});

module.exports = mongoose.model('User', userSchema);
