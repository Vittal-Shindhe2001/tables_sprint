import { ERROR, GET_USER } from "../actions/user_actions";

const initialstate = { data: {}, error: '' }

export const user_reducer = (state = initialstate, action) => {
    switch (action.type) {
        case GET_USER: {
            return { ...state, data: action.payload, error: '' }
        }
        case ERROR: {
            return { ...state, error: action.payload }
        }

        default:
            return { ...state }
    }
}