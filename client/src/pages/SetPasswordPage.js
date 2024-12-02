import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

let errorTimeout;

function SetPasswordPage() {
    const location = useLocation();
    const { email, token } = location.state;
    const [password, setPassword] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(true);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordStyle, setPasswordStyle] = useState({});
    const [confirmPasswordStyle, setConfirmPasswordStyle] = useState({});
    const navigate = useNavigate();

    const validatePassword = (password) => {
        if (password.length >= 8) {
            setIsValidPassword(true);
            setPasswordStyle({});
        } else {
            setIsValidPassword(false);
            setPasswordStyle({ borderColor: 'red' });
        }
    };

    const inputPasswordHandler = (event) => {
        const passwordValue = event.target.value;
        validatePassword(passwordValue);
        setPassword(passwordValue);
    };

    const inputConfirmPasswordHandler = (event) => {
        const confirmPasswordValue = event.target.value;
        setConfirmPassword(confirmPasswordValue);
        if (confirmPassword < 8) {
            setIsValidConfirmPassword(false);
            setConfirmPasswordStyle({ borderColor: 'red' });
        } else {
            setIsValidConfirmPassword(true);
            setConfirmPasswordStyle({});
        }
    };

    const setPasswordHandler = async () => {
        if (password === confirmPassword) {
            try {
                const response = await axios.post(
                    `${BASE_URL}/auth/set-password`,
                    {
                        email,
                        password,
                        confirmPassword,
                        verificationToken: token,
                    }
                );
                if (response.status === 201) {
                    console.log(response.data);
                    navigate('/success');
                } else {
                    setPasswordErrorMessage(response.data.message);
                    console.log(response.data.message);
                    clearTimeout(errorTimeout);
                    errorTimeout = setTimeout(() => {
                        setPasswordErrorMessage('');
                    }, 5000);
                }
            } catch (error) {
                if (error instanceof Error) {
                    console.log(
                        'Error setting password: ',
                        error.response.data.message
                    );
                } else {
                    console.log('Error setting password: ', error);
                }
                setPasswordErrorMessage(
                    'Error setting password. Please try again.'
                );
                clearTimeout(errorTimeout);
                errorTimeout = setTimeout(() => {
                    setPasswordErrorMessage('');
                }, 5000);
            }
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                Set Your Password
            </h2>
            <div className='w-80 space-y-4'>
                <input
                    type='password'
                    placeholder='Enter Password'
                    className='w-full p-3 border border-gray-300 rounded-lg'
                    value={password}
                    onChange={inputPasswordHandler}
                    style={passwordStyle}
                    required
                />
                {!isValidPassword && (
                    <p className='text-red-600 '>
                        Password must be at least 8 characters
                    </p>
                )}
                <input
                    type='password'
                    placeholder='Confirm Password'
                    className='w-full p-3 border border-gray-300 rounded-lg'
                    value={confirmPassword}
                    onChange={inputConfirmPasswordHandler}
                    style={confirmPasswordStyle}
                />
                {!isValidConfirmPassword && (
                    <p className='text-red-600'>Password must be the same</p>
                )}
                <button
                    className='w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600'
                    onClick={setPasswordHandler}
                >
                    Submit
                </button>
                {passwordErrorMessage && (
                    <p className='text-red-600 font-medium text-sm mt-4'>
                        {passwordErrorMessage}
                    </p>
                )}
            </div>
        </div>
    );
}

export default SetPasswordPage;
