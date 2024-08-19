import axios from "../config/axios"
import Swal from "sweetalert2"
import jwt_expired from "./jwt_expired"

export const ADD_CATEGORY = 'ADD_CATEGORY'
export const GET_CATEGORY = 'GET_CATEGORY'
export const UPDATE_CATEGORY = 'UPDATE_CATEGORY'
export const DELETE_CATEGORY = 'DELETE_CATEGORY'
export const ERROR = 'ERROR'

// set errors
export const set_error = (data) => {
    return {
        type: ERROR,
        payload: data
    }
}

// create new category
export const set_category = (data) => {
    return {
        type: ADD_CATEGORY,
        payload: data
    }
}

export const startAddCategory = (formdata, reset, handleClose) => {
    return (dispatch) => {
        (
            async () => {
                try {
                    const category = await axios.post('/category', formdata, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': localStorage.getItem('token')
                        }
                    })
                    if (category.data.message === "jwt expired") {
                        jwt_expired()
                    } else {
                        dispatch(set_category(category.data))
                        handleClose()
                        // Display a success alert
                        Swal.fire({
                            title: 'Success!',
                            text: 'Category added successfully.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        })

                        // Reset the form
                        reset()
                    }
                } catch (error) {
                    // Display an error alert
                    Swal.fire({
                        title: 'Error!',
                        text: error.response ? error.response.data.message : 'An error occurred while adding the category.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })

                    dispatch(set_error(error))
                }
            }
        )()
    }
}
// Retrive  all category 
export const set_Allcategory = (data) => {
    return {
        type: GET_CATEGORY,
        payload: data
    }
}

export const startGetAllCategory = () => {
    return (dispatch) => {
        (
            async () => {
                try {
                    const category = await axios.get('/category', { headers: { 'Authorization': localStorage.getItem('token') } })
                    if (category.data.message === "jwt expired") {
                        Swal.fire({
                            title: 'Session Expired',
                            text: 'Your session has expired. Please log in again.',
                            icon: 'warning',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            localStorage.removeItem('token')
                            window.location.href = '/login'
                        })
                    } else {
                        dispatch(set_Allcategory(category.data))
                    }
                } catch (error) {
                    dispatch(set_error(error))
                }
            }
        )()
    }
}

// update category
export const set_update_category = (data) => {
    return {
        type: UPDATE_CATEGORY,
        payload: data
    }
}

export const startUpdateCategory = (id, formData, handleClose, resetForm) => {
    return (dispatch) => {
        (
            async () => {
                try {
                    const category = await axios.put(`/category/${id}`, formData, { headers: { 'Authorization': localStorage.getItem('token') } })
                    if (category.data.message === "jwt expired") {
                        Swal.fire({
                            title: 'Session Expired',
                            text: 'Your session has expired. Please log in again.',
                            icon: 'warning',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            localStorage.removeItem('token')
                            window.location.href = '/login'
                        })
                    } else {
                        dispatch(set_update_category(category.data))
                        resetForm()
                        handleClose()

                        Swal.fire({
                            title: 'Success',
                            text: 'Subcategory updated successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'There was a problem updating the subcategory. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                    dispatch(set_error(error))

                }
            }
        )()
    }
}

// delete category
export const set_deleted_category = (data) => {
    return {
        type: DELETE_CATEGORY,
        payload: data
    }
}

export const startDeleteCategory = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`/category/${id}`, {
                headers: { 'Authorization': localStorage.getItem('token') }
            })

            // Check for JWT expiration
            if (response.data.message === "jwt expired") {
                jwt_expired()
            } else {
                // Successful deletion
                Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success",
                            timer: 1000
                        });
                        dispatch(set_deleted_category(id))
                    }
                });
            }
        } catch (error) {
            // Handle error
            Swal.fire({
                title: 'Error',
                text: 'An error occurred while deleting the category.',
                icon: 'error',
                confirmButtonText: 'OK'
            })
            dispatch(set_error(error))
        }
    }
}