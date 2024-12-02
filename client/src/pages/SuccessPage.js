import { Link } from 'react-router-dom';

const SuccessPage = () => {
    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <h2 className='text-3xl font-bold text-green-600 mb-4'>Registration Successful</h2>
            <p className='text-lg text-gray-600 mb-6'>You can now log in to your account.</p>
            <Link to='/login'>
                <button className='px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600'>Go to Login</button>
            </Link>
        </div>
    );
};

export default SuccessPage;
