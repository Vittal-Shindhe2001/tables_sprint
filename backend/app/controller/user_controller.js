const sendMail = require('../../config/nodemailer')
const User = require('../models/user_module')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const user_controller = {}

// Create a new user
user_controller.register = async (req, res) => {
    try {
        const { body } = req
        const userObj = new User(body)
        const salt = await bcrypt.genSalt()
        hashpassword = await bcrypt.hash(userObj.password, salt)
        userObj.password = hashpassword
        const user = await userObj.save()
        res.json(user)

    } catch (error) {
        res.json(error)
    }
}

// login user
user_controller.login = async (req, res) => {
    try {
        const { body } = req

        const user = await User.findOne({ email: body.email })
        if (!user) {
           return res.status(401).json({ error: 'invalid password or email' })
        }
        // Compare provided password with the stored hashed password
        const match = await bcrypt.compare(body.password, user.password)
        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }
        // Generate JWT token
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username
        }
        const token = jwt.sign(tokenData, process.env.JWT_KEY, { expiresIn: '1h' })
        res.status(200).json({
            token: `Bearer ${token}`
        })
    } catch (error) {
        res.json(error)
    }
}

// send forgot passeord link to user
user_controller.forgotPas = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ error: 'No user found with that email' })
        }

        const resetToken = user.createPasswordResetToken()
        await user.save()

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

        await sendMail(
            email,
            'Password Reset Request',
            `You requested a password reset. Click the link to reset your password: ${resetURL}`,
            `<p>You requested a password reset. Click the link to reset your password: <a href="${resetURL}">${resetURL}</a></p>`
        )

        res.status(200).json({ message: 'Password reset email sent' })
    } catch (error) {
        console.error('Error requesting password reset:', error)
        res.status(500).json({ error: 'Error requesting password reset' })
    }
}
user_controller.handleResetPassword = async (req, res) => {
    const { token } = req.params

    if (req.method === 'GET') {
        // Handle GET request
        try {
            const user = await User.findOne({
                resetToken: token,
                resetTokenExpiration: { $gt: Date.now() }
            })

            if (!user) {
                return res.status(400).json({ error: 'Token is invalid or has expired' })
            }

            // Token is valid, render the reset password form
            res.render('index', { token }) // Replace with your actual view or JSON response
        } catch (error) {
            console.error('Error verifying reset token:', error)
            res.status(500).json({ error: 'Error verifying reset token' })
        }
    } else if (req.method === 'POST') {
        // Handle POST request
        const {token}=req.params
        const { password } = req.body
        
        try {
            const user = await User.findOne({
                resetToken: token,
                resetTokenExpiration: { $gt: Date.now() }
            })

            if (!user) {
                return res.status(400).json({ error: 'Token is invalid or has expired' })
            }

            // Hash the new password
            const salt = await bcrypt.genSalt()
            const hashpassword = await bcrypt.hash(password, salt)

            // Update user's password and clear the reset token fields
            user.password = hashpassword
            user.resetToken = undefined
            user.resetTokenExpiration = undefined
            await user.save()

            res.status(200).json({ message: 'Password has been reset'})
            res.redirect(`${process.env.FRONTEND_URL}/login`)
        } catch (error) {
            console.error('Error resetting password:', error)
            res.status(500).json({ error: 'Error resetting password' })
        }
    }
}

// user_controller.resetpassword = async (req, res) => {
//     const { token } = req.params
//     // (token)

//     try {
//         const user = await User.findOne({
//             resetToken: token,
//             resetTokenExpiration: { $gt: Date.now() }
//         })

//         if (!user) {
//             return res.status(400).json({ error: 'Token is invalid or has expired' })
//         }
//         res.render('index',{token})
//     } catch (error) {
//         console.error('Error token varification:', error)
//         res.status(500).json({ error: 'Error resetting password' })
//     }
// }
// // set reset password
// user_controller.resetpassword = async (req, res) => {
//     const { token } = req.params
//     const { newPassword } = req.body
//     (token)


//     try {
//         const user = await User.findOne({
//             resetToken: token,
//             resetTokenExpiration: { $gt: Date.now() }
//         })

//         if (!user) {
//             return res.status(400).json({ error: 'Token is invalid or has expired' })
//         }
//         const salt = await bcrypt.genSalt()
//         hashpassword = await bcrypt.hash(newPassword, salt)

//         user.password = hashpassword
//         user.resetToken = undefined
//         user.resetTokenExpiration = undefined
//         await user.save()

//         res.status(200).json({ message: 'Password has been reset' })
//     } catch (error) {
//         console.error('Error resetting password:', error)
//         res.status(500).json({ error: 'Error resetting password' })
//     }
// }


user_controller.getById = async (req, res) => {
    try {
        const { id } = req.user
        const user = await User.findById(id)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
}
module.exports = user_controller
