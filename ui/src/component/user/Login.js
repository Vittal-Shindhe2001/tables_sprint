import React, { useState } from 'react'
import * as Yup from 'yup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from '../image/869311531ee26032e175620e2d0b5059.png'
import './login.css'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch } from 'react-redux';
import { startLoginUser } from '../../actions/user_actions';
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';
import {Button} from 'react-bootstrap'
import Forgot_password from './Forgot_password';
// Validation schema using Yup
const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
})

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)

    const [showAddModal, setShowAddModal] = useState(false);
    
    //dispatch
    const dispatch = useDispatch()
    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === 'email') {
            setEmail(value)
        } else if (name === 'password') {
            setPassword(value)
        }
    }
    const validateField = (name, value) => {
        try {
            // Create a schema for a single field
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
        const formData = { email, password }

        // form reset
        const reset = () => {
            setEmail('')
            setPassword('')
        }
        try {
            validationSchema.validateSync(formData, { abortEarly: false })
            // If validation passes, handle form submission
            dispatch(startLoginUser(formData, reset))

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
        <div className="login-container">
            {/* <div className="login-form"> */}
            {/* <div className="container d-flex justify-content-center align-items-center min-vh-100"> */}
            <div className="card me-5">
                <img src={logo} alt="Logo" />
                <center> <p>Welcome to TableSprint admin</p></center>
                <div className="card-body">
                    <div className='card-shadow'>
                        <form onSubmit={handleSubmit}>
                            <div className="form-floating mb-3">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    value={email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Email"
                                />
                                <label htmlFor="email">Email</label>
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            <div className="form-floating mb-3 position-relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    value={password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Password"
                                />
                                <label htmlFor="password">Password</label>
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                <span
                                    className="position-absolute top-50 end-0 translate-middle-y me-3 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </span>
                            </div>

                            <button type="submit" className="btn btn-primary w-100">Login</button>

                            <div className="d-flex justify-end">
                                <Link onClick={()=>setShowAddModal(!showAddModal)}>
                                    Forgot Password?
                                </Link>
                            </div>


                        </form>
                    </div>
                    {/* </div> */}
                    {/* </div> */}
                </div>
            </div>
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    
                </Modal.Header>
                <Modal.Body>
                    <Forgot_password handleClose={() => setShowAddModal(false)} />
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Login
