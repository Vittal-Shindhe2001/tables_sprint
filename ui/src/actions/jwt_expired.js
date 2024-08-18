import Swal from 'sweetalert2';

const jwt_expired = () => {
    return (
        Swal.fire({
            title: 'Session Expired',
            text: 'Your session has expired. Please log in again.',
            icon: 'warning',
            confirmButtonText: 'OK'
        }).then(() => {
            localStorage.removeItem('token')
            window.location.href = '/login'
        })
    )
}

export default jwt_expired
