import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <h1 className='text-4xl font-bold text-gray-800 mb-4'>
                Welcome to TaskMaster
            </h1>
            <p className='text-lg text-gray-600 mb-6'>
                Manage your tasks efficiently and stay organized!
            </p>
            <Link to='/login'>
                <button className='px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600'>
                    Login
                </button>
            </Link>
        </div>
    );
};

export default LandingPage;
