import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import './navbar.css'
import { Route } from 'react-router-dom/cjs/react-router-dom.min'
import Register from '../user/Register'
import Login from '../user/Login'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBox, faHouse, faIcons, faList, faTable, faUser } from '@fortawesome/free-solid-svg-icons'
import PrivateRoute from './PrivateRoutes'
import Dashboard from './Dashboard'
import Product_list from '../product/Product_list'
import Sub_ca_list from '../subCategroy/Sub_ca_list'
import Category_list from '../category/Category_list'
import Swal from 'sweetalert2'
const Navbar = (props) => {
    const token = localStorage.getItem('token')

    return (
        <>

            <div className="navbar-header">
                <div className="navbar-brand">
                    <h1><FontAwesomeIcon icon={faTable} /> TableSprint</h1>
                </div>
                {token && <div className="navbar-user">
                    <Link onClick={(e) => {
                        e.preventDefault(); // Prevent the default link behavior
                        Swal.fire({
                            title: 'Log Out',
                            text: "Are you sure you want to log out?",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Confirm',
                            cancelButtonText: 'Cancel'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                localStorage.clear();
                                props.history.push('/login');
                            }
                        });
                    }} > <FontAwesomeIcon icon={faUser} color='white' /></Link>
                </div>}
                <div className="navbar">
                    <ul className="navbar-list">
                        {token ? (
                            <>
                                <li className="navbar-item">
                                    <Link to="/dashboard"><FontAwesomeIcon icon={faHouse} /> Dashboard</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/category"><FontAwesomeIcon icon={faIcons} /> Category</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/subcategory"><FontAwesomeIcon icon={faList} /> Subcategory</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/product"><FontAwesomeIcon icon={faBox} /> Product</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="navbar-item">
                                    <Link to="/login">Login</Link>
                                </li>
                                <li className="navbar-item">
                                    <Link to="/signup">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div >

            <Route path='/signup' component={Register} exact={true} />
            <Route path='/login' exact={true}
                render={(props) => (
                    <Login {...props} />
                )} />
            <PrivateRoute path='/dashboard' component={Dashboard} />
            <PrivateRoute path='/category' component={Category_list} />
            <PrivateRoute path='/product' component={Product_list} />
            <PrivateRoute path='/subcategory' component={Sub_ca_list} />


        </>
    )
}

export default withRouter(Navbar)
