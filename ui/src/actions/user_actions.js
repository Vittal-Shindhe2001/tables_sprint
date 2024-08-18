import axios from "../config/axios"
import Swal from 'sweetalert2'
import jwt_expired from './jwt_expired'
export const ERROR = 'ERROR'
export const GET_USER = 'GET_USER'

export const set_error = (data) => {
    return {
        type: ERROR,
        payload: data
    }
}

// regisetr user
export const startRegisterUser = (formdata, reset) => {
    console.log(formdata);

    return (dispatch) => {
        (
            async () => {
                try {
                    const user = await axios.post('/register', formdata)
                    Swal.fire({
                        title: 'Success!',
                        text: 'Registration successful. Redirecting to login...',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        // Redirect to login page
                        reset()
                        window.location.href = '/login'
                    })
                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Registration failed. Please try again.',
                        icon: 'error'
                    })
                }
            }
        )()
    }
}

export const startLoginUser = (formdata) => {
    return (dispatch) => {
        (
            async () => {
                try {
                    const user = await axios.post('/login', formdata)
                    console.log(user);

                    Swal.fire({
                        title: 'Success!',
                        text: 'Login successful. Redirecting to Home...',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    }).then(() => {
                        // set token to localstorage
                        localStorage.setItem('token', user.data.token)
                        // Redirect to login page
                        window.location.href = '/dashboard'
                    })
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: error.response.data.error ? error.response.data.error : error,
                        icon: 'error'
                    })
                }
            }
        )()
    }
}
export const set_user = (data) => {
    return {
        type: GET_USER,
        payload: data
    }
}

export const startGetUserInfo = () => {
    return (dispatch) => {
        (
            async () => {
                try {
                    const user = await axios.get('/userInfo', { headers: { 'Authorization': localStorage.getItem('token') } })
                    if (user.data.message === "jwt expired") {
                        jwt_expired()
                    } else {
                        dispatch(set_user(user.data))
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed Get User Info. Please try again.',
                        icon: 'error'
                    })
                    dispatch(set_error(error))
                }
            }
        )()
    }
}

//forgot password 
export const startForgotPassword = (email, handleClose, setButtonDisable) => {
    console.log(email);

    return (dispatch) => {
        (
            async () => {
                try {
                    const responce = await axios.post('/forgot-password', { email })
                    if (responce.data) {
                        Swal.fire({
                            title: "Link sended your email address",
                            icon: "success"
                        })
                        handleClose()
                        setButtonDisable(true)
                    }
                } catch (error) {
                    Swal.fire({
                        title: error,
                        text: error.message,
                        icon: "error"
                    })
                    console.log(error);

                }
            }
        )()
    }
}