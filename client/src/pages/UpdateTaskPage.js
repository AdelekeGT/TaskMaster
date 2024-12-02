import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';
// import { useAuth } from '../context/AuthContext';

const UpdateTaskPage = () => {
    const { taskId } = useParams();
    const navigate = useNavigate();

    const [task, setTask] = useState({
        title: '',
        notes: '',
        priority: '',
        dueDate: '',
    });

    const [updateErrorMessage, setUpdateErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axios.get(`/user/task/${taskId}`);
                // const response = await axios.get('/user/task', {taskId});

                setTask(response.data.task);
                setIsLoading(false);
            } catch (error) {
                if (error.response) {
                    console.log(error.response.data.message);
                    setUpdateErrorMessage(error.response.data.message);
                } else if (error.request) {
                    console.log(error.request);
                    setUpdateErrorMessage('No response from server.');
                } else {
                    console.log(error.message);
                    setUpdateErrorMessage(
                        'Could not fetch task details. Please try again'
                    );
                }
                setIsLoading(false);
            }
        };
        fetchTask();
    }, [taskId]);

    const inputChangeHandler = (event) => {
        const { name, value } = event.target;
        setTask((prevTask) => ({ ...prevTask, [name]: value }));
    };

    const updateTaskHandler = async () => {
        try {
            console.log(task);
            const response = await axios.put(`/user/task/${taskId}`, { ...task });

            if (response.status === 200) {
                console.log(response.data.message, response.data.task);
                console.log(task);
                navigate('/dashboard');
            }
        } catch (error) {
            const errorMessage =
                error.response.data.message || error.request || error.message;
            console.log(errorMessage);
            setUpdateErrorMessage('Failed to update task. Please try again.');
        }
    };

    if (isLoading) return <p>Loading task details...</p>;

    return (
        <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center'>
            <h2 className='text-3xl font-bold text-gray-800 mb-6'>
                Update Task
            </h2>

            <form
                className='w-96 bg-white p-6 shadow-lg rounded-lg space-y-4'
                onSubmit={updateTaskHandler}
            >
                <div>
                    <label className='block text-gray-700' htmlFor='title'>
                        Title
                    </label>
                    <input
                        type='text'
                        id='title'
                        name='title'
                        className='w-full p-3 border border-gray-300 rounded-lg'
                        value={task.title}
                        onChange={inputChangeHandler}
                        required
                    />
                </div>

                <div>
                    <label htmlFor='notes' className='block text-gray-700'>
                        Notes
                    </label>
                    <textarea
                        name='notes'
                        id='notes'
                        className='w-full p-3 border border-gray-300 rounded-lg'
                        value={task.notes}
                        onChange={inputChangeHandler}
                        required
                    ></textarea>
                </div>

                <div>
                    <label htmlFor='priority' className='block text-gray-700'>
                        Priority
                    </label>
                    <select
                        name='priority'
                        id='priority'
                        className='w-full p-3 border-gray-300 rounded-lg'
                        value={task.priority}
                        onChange={inputChangeHandler}
                        required
                    >
                        <option value=''>Select Priority</option>
                        <option value='1'>Low</option>
                        <option value='2'>Medium</option>
                        <option value='3'>High</option>
                    </select>
                </div>

                {updateErrorMessage && (
                    <p className='text-red-600'>{updateErrorMessage}</p>
                )}

                <button
                    type='submit'
                    className='w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600'
                >
                    Update Task
                </button>
            </form>
        </div>
    );
};

export default UpdateTaskPage;
