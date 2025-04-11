import { Link } from 'react-router';
import logo from '../../assets/logo.png';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const NavBar = () => {

    const { user, logOut } = useContext(AuthContext)

    const handleLogout = async () => {
        try {
            await logOut();
            toast.success('Logout successful!');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };



    return (
        <div className="navbar bg-white shadow-sm">
            <div className="navbar-start">
                <Link to='/'><img src={logo} alt="logo" className='w-20 h-20' /></Link>
            </div>
            <div className="navbar-center lg:flex">
                <ul className="menu menu-horizontal px-1">

                    <li><Link to='/' className='text-[#9537c7] font-bold'>Home</Link></li>
                    <li><Link to='/items' className='text-[#9537c7] font-bold'>Items</Link></li>
                    <li><Link to='/bookings' className='text-[#9537c7] font-bold'>Bookings</Link></li>

                </ul>
            </div>
            <div className="navbar-end gap-4">
                {
                    user &&
                    <>
                        {user.email}
                    </>
                }
                {
                    user ?
                        <>
                            <button onClick={handleLogout} className="btn cursor-pointer py-2 text-white font-semibold rounded-md transition bg-gradient-to-r from-[#9537c7] to-[#3ec3ba] hover:opacity-90 border-none">Logout</button>
                        </> : <>
                            <Link to="/login" className="btn cursor-pointer py-2 text-white font-semibold rounded-md transition bg-gradient-to-r from-[#9537c7] to-[#3ec3ba] hover:opacity-90 border-none">Login</Link>
                            <Link to="/register" className="btn cursor-pointer py-2 text-white font-semibold rounded-md transition bg-gradient-to-r from-[#9537c7] to-[#3ec3ba] hover:opacity-90 border-none">Register</Link>
                        </>
                }

            </div>
        </div>
    )
}

export default NavBar