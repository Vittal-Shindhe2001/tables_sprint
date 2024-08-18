import React, { useEffect } from 'react';
import log from '../image/869311531ee26032e175620e2d0b5059.png'; // Adjust the path and filename as needed
import { useDispatch } from 'react-redux';
import { startGetUserInfo } from '../../actions/user_actions';

const Dashboard = () => {
  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(startGetUserInfo())
  },[]) 
  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-4'>
        </div>
        <div className='col-md-4'>
          <img src={log} alt="Logo" className="img-fluid" />
          <p>Welcome to TableSprint  admin</p>
        </div>
        <div className='col-md-4'>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
