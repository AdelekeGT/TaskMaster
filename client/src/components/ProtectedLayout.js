import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axiosInstance';

const ProtectedLayout = () => {
    const { logout } = useAuth();
    // const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const response = await axios.post('/logout');

            if (response.status === 200) {
                logout();
            }
        } catch (error) {
            const errorMessage =
                error.response.data.message || error.request || error.message;
            console.log(errorMessage);
        }
    };

    return (
        <div className='min-h-screen flex flex-col bg-gray-100'>
            {/*Header */}
            <header className='p-4 bg-blue-500 text-white flex justify-between items-center'>
                <Link className='text-xl font-bold' to='/dashboard'>
                    TaskMaster
                </Link>
                <button
                    className='px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600'
                    onClick={logoutHandler}
                >
                    Logout
                </button>
            </header>

            <main className='flex-1 p-6'>
                <Outlet /> {/*This renders the nested protected pages*/}
            </main>
        </div>
    );
};

export default ProtectedLayout;
