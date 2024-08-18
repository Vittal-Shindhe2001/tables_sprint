const { ADD_CATEGORY, GET_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY, ERROR } = require("../actions/category_actions");

const initialstate = { data: [], error: "" }

const category_reducer = (state = initialstate, action) => {
    switch (action.type) {
        case ADD_CATEGORY: {
            return { ...state, data:[...state.data, action.payload], error: " " }
        }
        case GET_CATEGORY: {
            return { ...state, data: action.payload, error: ' ' }

        }
        case UPDATE_CATEGORY: {
            const category = state.data.map(ele => {
                if (ele._id === action.payload._id) {
                    return { ...ele, ...action.payload }
                } else {
                    return { ...ele }
                }
            })
            return { ...state, data: category, error: ' ' }
        }
        case DELETE_CATEGORY: {
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

export default category_reducer