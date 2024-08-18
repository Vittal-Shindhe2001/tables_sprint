import axios from "../config/axios";
import Swal from "sweetalert2";
import jwt_expired from "./jwt_expired";

export const ADD_SUBCATEGORY = 'ADD_SUBCATEGORY'
export const GET_SUBCATEGORY = 'GET_SUBCATEGORY'
export const UPDATE_SUBCATEGORY = 'UPDATE_SUBCATEGORY'
export const DELETE_SUBCATEGORY = 'DELETE_SUBCATEGORY'
export const ERROR = 'ERROR'

// set errors
export const set_error = (data) => {
    return {
        type: ERROR,
        payload: data
    }
}

// create new category
export const set_sub_category = (data) => {
    return {
        type: ADD_SUBCATEGORY,
        payload: data
    }
}

export const startAddSubCategory = (formdat, reset, handleShow) => {
    return (dispatch) => {
        (
            async () => {
                try {
                    console.log(formdat);

                    const subCategory = await axios.post('/sub-category', formdat, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': localStorage.getItem('token')
                        }
                    })
                    if (subCategory.data.message === "jwt expired") {
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
                        dispatch(set_sub_category(subCategory.data))
                        reset()
                        handleShow()

                        Swal.fire({
                            title: 'Success',
                            text: 'Subcategory added successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'There was a problem adding the subcategory. Please try again.',
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
export const set_Allsubcategory = (data) => {
    return {
        type: GET_SUBCATEGORY,
        payload: data
    }
}

export const startGetAllSubCategory = () => {
    return (dispatch) => {
        (
            async () => {
                try {
                    const subCategory = await axios.get('/sub-category', { headers: { 'Authorization': localStorage.getItem('token') } })
                    dispatch(set_Allsubcategory(subCategory.data))
                } catch (error) {
                    dispatch(set_error(error))
                }
            }
        )()
    }
}

// update category
export const set_update_sub_category = (data) => {
    return {
        type: UPDATE_SUBCATEGORY,
        payload: data
    }
}

export const startUpdateSubCategory = (id, formData, handleClose, resetForm) => {
    return (dispatch) => {
        (
            async () => {
                try {
                    const subCategory = await axios.put(`/sub-category/${id}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': localStorage.getItem('token')
                        }
                    })
                    if (subCategory.data.message === "jwt expired") {
                        jwt_expired()
                    } else {
                        dispatch(set_update_sub_category(subCategory.data))
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
export const set_deleted_sub_category = (data) => {
    return {
        type: DELETE_SUBCATEGORY,
        payload: data
    }
}

export const startDeleteSubCategory = (id) => {
    return (dispatch) => {
        (
            async () => {
                try {
                    const category = await axios.delete(`/sub-category/${id}`, { headers: { 'Authorization': localStorage.getItem('token') } })
                    // Check for JWT expiration
                    if (category.data.message === "jwt expired") {
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
                                dispatch(set_deleted_sub_category(id))
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
        )()
    }
}