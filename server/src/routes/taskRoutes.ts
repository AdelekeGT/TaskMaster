import { Router } from 'express';
import {
    createTaskHandler,
    getUserTasksHandler,
    getUserTaskHandler,
    updateUserTaskHandler,
    deleteUserTaskHandler,
} from '../controllers/taskController';
import validateUserJWTTokenMiddleware from '../middlewares/validateUser';

const taskRouter = Router();

taskRouter.post(
    '/user/task',
    validateUserJWTTokenMiddleware,
    createTaskHandler
);
taskRouter.get(
    '/user/tasks',
    validateUserJWTTokenMiddleware,
    getUserTasksHandler
);
taskRouter.get(
    '/user/task/:taskId',
    validateUserJWTTokenMiddleware,
    getUserTaskHandler
);
taskRouter.put(
    '/user/task/:taskId',
    validateUserJWTTokenMiddleware,
    updateUserTaskHandler
);
taskRouter.delete(
    '/user/task/:taskId',
    validateUserJWTTokenMiddleware,
    deleteUserTaskHandler
);

export default taskRouter;
