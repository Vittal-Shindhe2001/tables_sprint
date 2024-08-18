import { ADD_PRODUCT, DELETE_PRODUCT, ERROR, GET_PRODUCT, UPDATE_PRODUCT } from "../actions/product_actios"


const initialstate = { data: [], error: "" }

const product_reducer = (state = initialstate, action) => {
    switch (action.type) {
        case ADD_PRODUCT: {
            return { ...state, data: [...state.data, action.payload], error: " " }
        }
        case GET_PRODUCT: {
            return { ...state, data: action.payload, error: ' ' }

        }
        case UPDATE_PRODUCT: {
            const category = state.data.map(ele => {
                if (ele._id === action.payload._id) {
                    return { ...ele, ...action.payload }
                } else {
                    return { ...ele }
                }
            })
            return { ...state, data: category, error: ' ' }
        }
        case DELETE_PRODUCT: {
            const category = state.data.filter(ele => ele._id !== action.payload)
            return { ...state, data: category, error: '' }
        }
        case ERROR: {
            return { ...state, error: action.payload }
        }
        default: {
            return { ...state }
        }

    }
}

export default product_reducer