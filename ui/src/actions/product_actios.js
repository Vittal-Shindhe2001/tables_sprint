import axios from "../config/axios"
import Swal from "sweetalert2"
import jwt_expired from "./jwt_expired"

export const ADD_PRODUCT = 'ADD_PRODUCT'
export const GET_PRODUCT = 'GET_PRODUCT'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const ERROR = 'ERROR'

// set errors
export const set_error = (data) => {
    return {
        type: ERROR,
        payload: data
    }
}

// create new PRODUCT
export const set_product = (data) => {
    return {
        type: ADD_PRODUCT,
        payload: data
    }
}

export const startAddproduct = (formdat, handleClose, resetForm) => {
    return (dispatch) => {
        (
            async () => {
                try {
                    const product = await axios.post('/product', formdat, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': localStorage.getItem('token') } })
                    if (product.data.message === "jwt expired") {
                        jwt_expired()
                    } else {
                        dispatch(set_product(product.data))
                        // reset form
                        resetForm()
                        handleClose()

                        Swal.fire({
                            title: 'Success',
                            text: 'Product added successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        })
                    }
                } catch (error) {
                    console.log(error);

                    Swal.fire({
                        title: 'Error',
                        text: 'There was a problem adding the Product. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                    dispatch(set_error(error))

                }
            }
        )()
    }
}
// Retrive  all product 
export const set_Allproduct = (data) => {
    return {
        type: GET_PRODUCT,
        payload: data
    }
}

export const startGetAllProduct = () => {
    return (dispatch) => {
        (
            async () => {
                try {
                    const product = await axios.get('/product', { headers: { 'Authorization': localStorage.getItem('token') } })
                    dispatch(set_Allproduct(product.data))
                } catch (error) {
                    dispatch(set_error(error))
                }
            }
        )()
    }
}

// update product
export const set_update_product = (data) => {
    return {
        type: UPDATE_PRODUCT,
        payload: data
    }
}

export const startUpdateProduct = (id,formData, handleClose, resetForm) => {
    console.log(formData);
    
    return (dispatch) => {
        (
            async () => {
                try {
                    const product = await axios.put(`/product/${id}`, formData, {
                        headers: {

                            'Authorization': localStorage.getItem('token')
                        }
                    })
                    if (product.data.message === "jwt expired") {
                        jwt_expired()
                    } else {
                        dispatch(set_update_product(product.data))
                        resetForm()
                        handleClose()

                        Swal.fire({
                            title: 'Success',
                            text: 'Subcategory Updated successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'There was a problem updating the Product. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    })
                    dispatch(set_error(error))

                }
            }
        )()
    }
}

// delete product
export const set_deleted_product = (data) => {
    return {
        type: DELETE_PRODUCT,
        payload: data
    }
}

export const startDeleteProduct = (id) => {
    return (dispatch) => {
        (
            async () => {
                try {
                    const product = await axios.delete(`/product/${id}`, { headers: { 'Authorization': localStorage.getItem('token') } })
                    // Check for JWT expiration
                    if (product.data.message === "jwt expired") {
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
                                dispatch(set_deleted_product(id))
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