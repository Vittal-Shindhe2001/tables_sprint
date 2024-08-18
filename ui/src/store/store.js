import { createStore, combineReducers, applyMiddleware } from 'redux'
import {thunk} from 'redux-thunk'
import category_reducer from '../reducer/category_reducer'
import product_reducer from '../reducer/product_reducer'
import sub_category_reducer from '../reducer/sub_category_reducer'
import { user_reducer } from '../reducer/use_reducer'

const configureStore = () => {
    const store = createStore(combineReducers({
        user: user_reducer,
        category: category_reducer,
        product: product_reducer,
        subCategory: sub_category_reducer
    }), applyMiddleware(thunk))
    return store
}

export default configureStore