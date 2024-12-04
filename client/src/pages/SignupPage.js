import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../utils/baseUrl';

function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [isValidName, setIsValidName] = useState(true);
    const [emailInputStyle, setEmailInputStyle] = useState({});
    const [nameInputStyle, setNameInputStyle] = useState({});
    const [signupErrorMessage, setSignupErrorMessage] = useState('');
    const navigate = useNavigate();

    let errorTimeout;

    const inputNameHandler = (event) => {
        const nameValue = event.target.value;
        validateName(nameValue);
        setName(nameValue);
    };

    const inputEmailHandler = (event) => {
        const emailValue = event.target.value;
        validateEmail(emailValue);
        setEmail(emailValue);
    };

    const inputPhoneHandler = (e) => setPhone(e.target.value);

    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z0-9 ]{8,}$/;
        if (nameRegex.test(name)) {
            setIsValidName(true);
            setNameInputStyle({});
        } else {
            setIsValidName(false);
            setNameInputStyle({ borderColor: 'red' });
        }
    };
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            setIsValidEmail(true);
            setEmailInputStyle({});
        } else {
            setIsValidEmail(false);
            setEmailInputStyle({ borderColor: 'red' });
        }
    };

    const signupHandler = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/signup`, {
                name,
                email,
                phone,
            });

            if (response.status === 201) {
                console.log(response.data.message);
                navigate('/otp-verification', { state: { email } });
            } else {
                setSignupErrorMessage(response.data.message);
                clearTimeout(errorTimeout);
                errorTimeout = setTimeout(() => {
                    setSignupErrorMessage('');
                }, 5000); // Clear the error message after 5 seconds
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setSignupErrorMessage(error.response.data.message);
            } else if (error.request) {
                // The request was made but no response was received
                setSignupErrorMessage(
                    'No response from server. Please try again.'
                );
            } else {
                // Something happened in setting up the request that triggered an Error
                setSignupErrorMessage('Signup failed. Please try again.');
            }
            console.log(error.response.data.message || error.message);
            clearTimeout(errorTimeout);
            errorTimeout = setTimeout(() => {
                setSignupErrorMessage('');
            }, 5000); // Clear the error message after 5 seconds
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Sign Up</h2>
            <div className='w-80 space-y-4'>
                <input
                    type='text'
                    placeholder='Your name'
                    className='w-full p-3 border border-gray-300 rounded-lg'
                    value={name}
                    onChange={inputNameHandler}
                    style={nameInputStyle}
                    required
                />
                {!isValidName && (
                    <p className='text-red-700 mb-2'>
                        @!#$%^&*+=.?/- not allowed
                    </p>
                )}
                <input
                    type='email'
                    placeholder='youremail@gmail.com'
                    className='w-full p-3 border border-gray-300 rounded-lg'
                    value={email}
                    onInput={inputEmailHandler}
                    style={emailInputStyle}
                    required
                />
                {!isValidEmail && (
                    <p className='text-red-700 mb-2'>Invalid Email</p>
                )}
                <input
                    type='text'
                    placeholder='0800 000 0000'
                    className='w-full p-3 border border-gray-300 rounded-lg'
                    value={phone}
                    onChange={inputPhoneHandler}
                    required
                />
                <button
                    className='w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600'
                    onClick={signupHandler}
                >
                    Sign Up
                </button>
            </div>
            {signupErrorMessage && (
                <p className='text-red-700 font-medium text-sm mt-4'>
                    {signupErrorMessage}
                </p>
            )}
        </div>
    );
}

export default SignupPage;
