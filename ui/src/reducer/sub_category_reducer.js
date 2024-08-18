import { ADD_SUBCATEGORY, DELETE_SUBCATEGORY, ERROR, GET_SUBCATEGORY, UPDATE_SUBCATEGORY } from "../actions/subCategory_actions"

const initialstate = { data: [], error: "" }

const sub_category_reducer = (state = initialstate, action) => {
    switch (action.type) {
        case ADD_SUBCATEGORY: {
            return { ...state, data: [...state.data, action.payload], error: " " }
        }
        case GET_SUBCATEGORY: {
            return { ...state, data: action.payload, error: ' ' }

        }
        case UPDATE_SUBCATEGORY: {
            const category = state.data.map(ele => {
                if (ele._id === action.payload._id) {
                    return { ...ele, ...action.payload }
                } else {
                    return { ...ele }
                }
            })
            return { ...state, data: category, error: ' ' }
        }
        case DELETE_SUBCATEGORY: {
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

export default sub_category_reducer