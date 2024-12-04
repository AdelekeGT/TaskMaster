"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const validateUser_1 = __importDefault(require("../middlewares/validateUser"));
const taskRouter = (0, express_1.Router)();
taskRouter.post('/user/task', validateUser_1.default, taskController_1.createTaskHandler);
taskRouter.get('/user/tasks', validateUser_1.default, taskController_1.getUserTasksHandler);
taskRouter.get('/user/task/:taskId', validateUser_1.default, taskController_1.getUserTaskHandler);
taskRouter.put('/user/task/:taskId', validateUser_1.default, taskController_1.updateUserTaskHandler);
taskRouter.delete('/user/task/:taskId', validateUser_1.default, taskController_1.deleteUserTaskHandler);
exports.default = taskRouter;
