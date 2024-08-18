import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

// You can import CSS for styling or use inline styles as needed

const Logout = () => {
    const handleCancel = () => {
        // Logic for canceling logout, such as redirecting back to a different page
        console.log('Logout canceled')
    }

    const handleConfirm = () => {
        // Logic for confirming logout, such as clearing user session and redirecting to the login page
        console.log('Logged out successfully')
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Logout</h1>
            <div>
                <FontAwesomeIcon icon={faSignOutAlt} size="3x" />
            </div>
            <p>Are you sure you want to log out?</p>
            <div>
                <button onClick={handleCancel} style={{ marginRight: '10px' }}>
                    Cancel
                </button>
                <button onClick={handleConfirm} style={{ backgroundColor: 'red', color: 'white' }}>
                    Confirm
                </button>
            </div>
        </div>
    )
}

export default Logout
