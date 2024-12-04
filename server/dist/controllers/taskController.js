"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserTaskHandler = exports.updateUserTaskHandler = exports.getUserTaskHandler = exports.getUserTasksHandler = exports.createTaskHandler = void 0;
const task_1 = __importDefault(require("../models/task"));
const createTaskHandler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, notes, dueDate, priority } = request.body;
    if (!title || !notes || !dueDate || !priority) {
        return response
            .status(400)
            .json({ message: 'All fields are required' });
    }
    try {
        const user = request.user;
        const task = yield task_1.default.create({
            userId: user.id,
            title,
            notes,
            dueDate,
            priority,
        });
        return response.status(201).json({ task });
    }
    catch (error) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
});
exports.createTaskHandler = createTaskHandler;
const getUserTasksHandler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        const tasks = yield task_1.default.find({ userId: user.id });
        return response.status(200).json({ tasks });
    }
    catch (error) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
});
exports.getUserTasksHandler = getUserTasksHandler;
const getUserTaskHandler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        const { taskId } = request.params;
        if (!taskId) {
            return response
                .status(400)
                .json({ message: 'Task ID is required' });
        }
        const task = yield task_1.default.findOne({ _id: taskId, userId: user.id });
        return response.status(200).json({ task });
    }
    catch (error) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
});
exports.getUserTaskHandler = getUserTaskHandler;
const updateUserTaskHandler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        const { taskId } = request.params;
        const { title, notes, dueDate, priority } = request.body;
        if (!taskId) {
            return response
                .status(400)
                .json({ message: 'Task ID is required' });
        }
        const updatedTask = yield task_1.default.findOneAndUpdate({ _id: taskId, userId: user.id }, { title, notes, dueDate, priority }, { new: true });
        console.log('Task updated successfully', updatedTask);
        return response
            .status(200)
            .json({ message: 'Task successfully updated', task: updatedTask });
    }
    catch (error) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
});
exports.updateUserTaskHandler = updateUserTaskHandler;
const deleteUserTaskHandler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        const { taskId } = request.params;
        console.log(taskId);
        if (!taskId) {
            return response
                .status(400)
                .json({ message: 'Task ID is required' });
        }
        const deletedTask = yield task_1.default.findOneAndDelete({
            _id: taskId,
            userId: user.id,
        });
        console.log('Task deleted successfully', deletedTask);
        response.status(200).json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        if (error instanceof Error)
            return response.status(500).json({ error: error.message });
        return response.status(500).json({ error });
    }
});
exports.deleteUserTaskHandler = deleteUserTaskHandler;
