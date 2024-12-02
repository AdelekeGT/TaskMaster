import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

let errorTimeout;

function LoginPage() {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const inputEmailOrPhoneHandler = (event) => {
        setEmailOrPhone(event.target.value);
    };

    const inputPasswordHandler = (event) => {
        setPassword(event.target.value);
    };

    const loginHandler = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/login`, {
                emailOrPhone,
                password,
            });

            if (response.status === 200) {
                console.log(response.data.message);
                const authenticationToken = response.data.token;

                // Update the authentication state in the context
                login(authenticationToken);

                // NAvigate to dashboard
                navigate('/dashboard');
            } else {
                const errorMessage =
                    response.data.message || response.data.error;
                console.log(errorMessage);
                setLoginErrorMessage(errorMessage);
                clearTimeout(errorTimeout);
                errorTimeout = setTimeout(() => {
                    setLoginErrorMessage('');
                }, 4000);
            }
        } catch (error) {
            console.error('Error logging in', error.message);
            setLoginErrorMessage('Error logging in. Please try again.');
            clearTimeout(errorTimeout);
            errorTimeout = setTimeout(() => {
                setLoginErrorMessage('');
            }, 4000);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                Login to TaskMaster
            </h2>
            <div className='w-80 space-y-4'>
                <input
                    type='text'
                    placeholder='Email or Phone number'
                    className='w-full p-3 border border-gray-300 rounded-lg'
                    value={emailOrPhone}
                    onChange={inputEmailOrPhoneHandler}
                    required
                />

                <input
                    type='password'
                    placeholder='Password'
                    className='w-full p-3 border border-gray-300 rounded-lg'
                    value={password}
                    onChange={inputPasswordHandler}
                    required
                />

                <button
                    className='w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:'
                    onClick={loginHandler}
                >
                    Login
                </button>
            </div>

            {loginErrorMessage && (
                <p className='text-red-600 font-medium text-sm my-4'>
                    {loginErrorMessage}
                </p>
            )}

            <p className='mt-4 text-gray-600'>
                Don't have an account?{' '}
                <Link
                    to='/signup'
                    className='text-blue-500 hover:underline hover:text-blue-600'
                >
                    Sign up
                </Link>
            </p>
        </div>
    );
}

export default LoginPage;
