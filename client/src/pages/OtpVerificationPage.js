import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../utils/baseUrl';

let errorTimeout;

function OtpVerificationPage() {
    const location = useLocation();
    const { email } = location.state;
    const [otp, setOtp] = useState('');
    const [otpErrorMessage, setOtpErrorMessage] = useState('');
    const navigate = useNavigate();

    const verifyOtpHandler = async () => {
        try {
            const response = await axios.post(`${BASE_URL}/auth/verify-otp`, {
                email,
                otp,
            });

            if (response.status === 200) {
                const { token } = response.data;
                console.log('OTP verification successful!');
                navigate('/set-password', { state: { email, token } });
            } else {
                const { message } = response.data;
                setOtpErrorMessage(message);
                clearTimeout(errorTimeout);
                errorTimeout = setTimeout(() => {
                    setOtpErrorMessage('');
                }, 5000);
            }
        } catch (error) {
            console.log('Error verifying OTP: ', error.message);
            setOtpErrorMessage('OTP verification failed. Please try again.');
            clearTimeout(errorTimeout);
            errorTimeout = setTimeout(() => {
                setOtpErrorMessage('');
            }, 5000);
        }
    };

    const inputOtpHandler = (event) => setOtp(event.target.value);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4'>
                Verify OTP
            </h2>
            <p className='text-gray-600 mb-6'>
                An OTP has been sent to your email. Please enter it below.
            </p>
            <input
                type='text'
                placeholder='Enter OTP'
                className='w-80 p-3 border border-gray-300 rounded-lg mb-4 text-center'
                value={otp}
                onChange={inputOtpHandler}
                required
            />
            <button
                className='px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600'
                onClick={verifyOtpHandler}
            >
                Verify
            </button>
            {otpErrorMessage && (
                <p className='text-red-700 font-medium text-sm mt-4'>
                    {otpErrorMessage}
                </p>
            )}
        </div>
    );
}

export default OtpVerificationPage;
