import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { startForgotPassword } from '../../actions/user_actions';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const ForgotPassword = ({ handleClose }) => {
    const [buttonDisable, setButtonDisable] = useState(false)
    const dispatch = useDispatch()
    const handleSubmit = (e) => {
        e.preventDefault();
        const emailInput = document.getElementById("emailInput");
        const email = emailInput.value;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailPattern.test(email)) {
            dispatch(startForgotPassword(email, handleClose,setButtonDisable))
            setButtonDisable(!buttonDisable)
        } else {
            alert("Please enter a valid email address.");
        }
    };

    return (
        <div className="card" style={{ maxWidth: "400px", margin: "auto" }}>
            <div className="card-body">
                <h5 className="card-title">Did you forget your password?</h5>
                <p>Enter your email address and we’ll send you a link to restore your password.</p>
                <form id="emailForm" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="emailInput" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="emailInput"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" disabled={buttonDisable} className="btn" style={{ width: '13rem', backgroundColor: '#5C218B', color: 'white' }}>
                            Request reset link
                        </button>

                    </div>
                    <div className="d-flex justify-content-center">
                        <Link onClick={() => { handleClose() }}>Back to Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
