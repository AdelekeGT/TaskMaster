import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosInstance';

let errorTimeout;

const DashboardPage = () => {
    const [search, setSearch] = useState('');
    const [tasks, setTasks] = useState([]);
    const [deleteTaskErrorMessage, setDeleteTaskErrorMessage] = useState('');
    const [fetchTaskErrorMessage, setFetchTaskErrorMessage] = useState('');

    const getUserTasks = async () => {
        try {
            const response = await axios.get('/user/tasks');
            const { tasks } = response.data;
            setTasks(tasks);
        } catch (error) {
            console.log('Error fetching tasks: ', error.message);
            setFetchTaskErrorMessage('Error fetching tasks');
        }
    };

    useEffect(() => {
        getUserTasks();
    }, []); // Fetch tasks on component mount

    const inputSearchHandler = (event) => setSearch(event.target.value);

    const deleteTaskHandler = async (taskId) => {
        try {
            const response = await axios.delete(`/user/task/${taskId}`);

            if (response.status === 200) {
                console.log('Task successfully deleted');
                setTasks(tasks.filter((task) => task._id !== taskId));
            } else {
                setDeleteTaskErrorMessage(response.data.message);
                clearTimeout(errorTimeout);
                errorTimeout = setTimeout(() => {
                    setDeleteTaskErrorMessage('');
                }, 5000);
            }
        } catch (error) {
            console.log(error.message);
            setDeleteTaskErrorMessage(
                'Could not delete task. Please try again.'
            );
            clearTimeout(errorTimeout);
            errorTimeout = setTimeout(() => {
                setDeleteTaskErrorMessage('');
            }, 5000);
        }
    };

    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            <div className='mb-6'>
                <h2 className='text-3xl font-bold text-gray-800'>Dashboard</h2>
            </div>
            <div className='mb-4'>
                <input
                    type='text'
                    placeholder='Search Tasks'
                    className='w-full p-3 border-gray-300 rounded-lg'
                    value={search}
                    onChange={inputSearchHandler}
                />
            </div>
            <Link to='/add-task'>
                <button className='px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600'>
                    Add New Task
                </button>
            </Link>

            <ul className='mt-6'>
                {tasks.length === 0 && (
                    <p className='text-gray-800 my-4 text-sm'>
                        You have no tasks yet.
                    </p>
                )}
                {fetchTaskErrorMessage && (
                    <p className='text-red-600 mx-4'>{fetchTaskErrorMessage}</p>
                )}
                {tasks
                    .filter((task) =>
                        task.title.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((task) => (
                        <li
                            key={task._id}
                            className='flex justify-between items-center p-4 border border-gray-300 round-lg'
                        >
                            <div>
                                <h4 className='font-bold text-gray-800'>
                                    {task.title}
                                </h4>
                                <p>{task.notes}</p>
                                <span className='text-sm text-blue-500'>
                                    Priority: {task.priority}
                                </span>
                            </div>

                            <div className='flex space-x-4'>
                                {/*Update Button */}
                                <Link to={`/update-task/${task._id}`}>
                                    <button className='text-blue-500 hover:underline'>
                                        Update
                                    </button>
                                </Link>

                                {/*Delete Button */}
                                <button
                                    className='text-red-500 hover:underline'
                                    onClick={() => deleteTaskHandler(task._id)}
                                >
                                    Delete
                                </button>
                            </div>
                            {deleteTaskErrorMessage && (
                                <p className='text-red-600 mt-3'>
                                    {deleteTaskErrorMessage}
                                </p>
                            )}
                        </li>
                    ))}
            </ul>
        </div>
    );
};

export default DashboardPage;
