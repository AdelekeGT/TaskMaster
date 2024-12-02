import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './components/ProtectedLayout'; // Import the layout
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import SetPasswordPage from './pages/SetPasswordPage';
import SuccessPage from './pages/SuccessPage';
import DashboardPage from './pages/DashboardPage';
import AddTaskPage from './pages/AddTaskPage';
import UpdateTaskPage from './pages/UpdateTaskPage';

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/otp-verification' element={<OtpVerificationPage />} />
            <Route path='/set-password' element={<SetPasswordPage />} />
            <Route path='/success' element={<SuccessPage />} />

            {/* Protected Routes with Layout */}
            <Route
                path='/'
                element={
                    <ProtectedRoute>
                        <ProtectedLayout />{' '}
                        {/* Wrap protected routes in the layout */}
                    </ProtectedRoute>
                }
            >
                <Route path='dashboard' element={<DashboardPage />} />
                <Route path='add-task' element={<AddTaskPage />} />
                <Route
                    path='update-task/:taskId'
                    element={<UpdateTaskPage />}
                />
            </Route>
        </Routes>
    );
}

export default App;
