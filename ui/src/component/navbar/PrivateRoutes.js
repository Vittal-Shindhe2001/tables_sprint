import React from "react"
import { Route, Redirect } from "react-router-dom/cjs/react-router-dom.min"
const PrivateRoute = ({ component: Component, ...rest }) => {
    const token=localStorage.getItem('token')
    return (
        <Route
            {...rest}
            render={(props) => {
                return token ? (        
                    <Component {...props}  />
                ) :
                    <Redirect to={{ pathname: "/login" }} />
            }}
        />
    )
}

export default PrivateRoute