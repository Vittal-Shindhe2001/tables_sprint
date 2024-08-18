const mongoose = require('mongoose')
const crypto = require('crypto')

// Define the user schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetToken: String,
    resetTokenExpiration: Date
})

UserSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.resetToken = resetToken
    this.resetTokenExpiration = Date.now() +  5 * 60 * 1000
    return resetToken
}

// Create the user model
const User = mongoose.model('User', UserSchema);

module.exports = User
