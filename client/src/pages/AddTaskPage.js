import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
// import { useAuth } from '../context/AuthContext';

const AddTaskPage = () => {
    // const { isAuthenticated } = useAuth();
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [priority, setPriority] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [addTaskErrorMessage, setAddTaskErrorMessage] = useState('');
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!isAuthenticated.isLoggedIn) {
    //         navigate('/login');
    //     }
    // }, [isAuthenticated.isLoggedIn, navigate]);

    const inputTitleHandler = (event) => setTitle(event.target.value);
    const inputNotesHandler = (event) => setNotes(event.target.value);
    const inputPriorityHandler = (event) => setPriority(event.target.value);
    const inputDueDateHandler = (event) => setDueDate(event.target.value);

    const addTaskHandler = async () => {
        const response = await axios.post('/user/task', {
            title,
            notes,
            priority,
            dueDate,
        });

        if (response.status === 201) {
            console.log({
                message: 'New task succesfully created',
                task: response.data,
            });
            navigate('/dashboard');
        } else {
            const errorMessage = response.data.message || response.data.error;
            console.log(errorMessage);

            if (response.data.message) {
                setAddTaskErrorMessage(response.data.message);
            } else {
                setAddTaskErrorMessage('Could not add task. Please try again.');
            }
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            <h2 className='text-2xl font-bold text-gray-800 mb-6'>
                Add New Task
            </h2>
            <div className='w-80 space-y-4'>
                <input
                    type='text'
                    placeholder='Task Title'
                    className='w-full p-3 border border-gray-300 rounded-lg'
                    value={title}
                    onChange={inputTitleHandler}
                />
                <textarea
                    name='notes'
                    id='notes'
                    placeholder='Notes'
                    className='w-full p-3 border border-gray-300 rounded-lg'
                    value={notes}
                    onChange={inputNotesHandler}
                />
                <select
                    name='priority'
                    id='priority'
                    className='w-full p-3 border border-gray-300 rounded-lg'
                    value={priority}
                    onChange={inputPriorityHandler}
                >
                    <option value='' disabled>
                        Select Priority
                    </option>
                    <option value='1'>Low</option>
                    <option value='2'>Medium</option>
                    <option value='3'>High</option>
                </select>
                <input
                    type='date'
                    className='w-full p-3 border border-gray-300 rounded-lg'
                    value={dueDate}
                    onChange={inputDueDateHandler}
                />
                <button
                    className='w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600'
                    onClick={addTaskHandler}
                >
                    Add Task
                </button>

                {addTaskErrorMessage && (
                    <p className='text-red-600 mt-4'>{addTaskErrorMessage}</p>
                )}
            </div>
        </div>
    );
};

export default AddTaskPage;
