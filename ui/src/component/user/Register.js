import React, { useState } from 'react'
import * as Yup from 'yup';
import { useDispatch } from 'react-redux'
import { startRegisterUser } from '../../actions/user_actions';
// Validation schema using Yup
const validationSchema = Yup.object({
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
})

const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})

    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === 'username') {
            setUsername(value)
        } else if (name === 'email') {
            setEmail(value)
        } else if (name === 'password') {
            setPassword(value)
        }
    }
    //onblur validation
    const validateField = (name, value) => {
        try {
            const fieldSchema = Yup.object().shape({
                [name]: validationSchema.fields[name]
            });
            fieldSchema.validateSync({ [name]: value });
            // Clear error if validation passes
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        } catch (err) {
            // Handle validation error
            setErrors((prevErrors) => ({ ...prevErrors, [name]: err.message }));
        }
    }
    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validate form data
        const formData = { username, email, password }

        //reset form
        const reset = () => {
            setUsername('')
            setPassword('')
            setEmail('')
        }
        try {
            validationSchema.validateSync(formData, { abortEarly: false })
            // If validation passes, handle form submission
            dispatch(startRegisterUser(formData, reset))
            setErrors({})
        } catch (err) {
            // Format errors and set them in the state
            const formattedErrors = err.inner.reduce((acc, error) => {
                acc[error.path] = error.message
                return acc
            }, {})
            setErrors(formattedErrors)
        }
    }

    return (
        <div className='container'>
            <h1 className='my-4 text-center'>Register</h1>
            <div className='card mx-auto' style={{ maxWidth: '600px' }}>
                <div className='card-body'>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label htmlFor="username" className="form-label">Username:</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                value={username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                        </div>

                        <div className='mb-3'>
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                value={email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className='mb-3'>
                            <label htmlFor="password" className="form-label">Password:</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                value={password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Register</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
