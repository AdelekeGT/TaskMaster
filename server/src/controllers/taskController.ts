import { RequestHandler } from 'express';
import Task from '../models/task';
import { request } from 'http';

const createTaskHandler: RequestHandler = async (
    request: any,
    response: any
) => {
    const { title, notes, dueDate, priority } = request.body;

    if (!title || !notes || !dueDate || !priority) {
        return response
            .status(400)
            .json({ message: 'All fields are required' });
    }

    try {
        const user = request.user;

        const task = await Task.create({
            userId: user.id,
            title,
            notes,
            dueDate,
            priority,
        });

        return response.status(201).json({ task });
    } catch (error: unknown) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
};

const getUserTasksHandler: RequestHandler = async (
    request: any,
    response: any
) => {
    try {
        const user = request.user;

        const tasks = await Task.find({ userId: user.id });

        return response.status(200).json({ tasks });
    } catch (error: unknown) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
};

const getUserTaskHandler: RequestHandler = async (
    request: any,
    response: any
) => {
    try {
        const user = request.user;
        const { taskId } = request.params;

        if (!taskId) {
            return response
                .status(400)
                .json({ message: 'Task ID is required' });
        }

        const task = await Task.findOne({ _id: taskId, userId: user.id });

        return response.status(200).json({ task });
    } catch (error: unknown) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
};

const updateUserTaskHandler: RequestHandler = async (
    request: any,
    response: any
) => {
    try {
        const user = request.user;
        const { taskId } = request.params;
        const { title, notes, dueDate, priority } = request.body;

        if (!taskId) {
            return response
                .status(400)
                .json({ message: 'Task ID is required' });
        }

        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, userId: user.id },
            { title, notes, dueDate, priority },
            { new: true }
        );

        console.log('Task updated successfully', updatedTask);
        return response
            .status(200)
            .json({ message: 'Task successfully updated', task: updatedTask });
    } catch (error: unknown) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
};

const deleteUserTaskHandler: RequestHandler = async (
    request: any,
    response: any
) => {
    try {
        const user = request.user;
        const { taskId } = request.params;
        console.log(taskId);
        if (!taskId) {
            return response
                .status(400)
                .json({ message: 'Task ID is required' });
        }

        const deletedTask = await Task.findOneAndDelete({
            _id: taskId,
            userId: user.id,
        });
        console.log('Task deleted successfully', deletedTask);
        response.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
};

export {
    createTaskHandler,
    getUserTasksHandler,
    getUserTaskHandler,
    updateUserTaskHandler,
    deleteUserTaskHandler,
};
