import express from 'express';
import { UserController } from '../controllers';
import { UserValidator } from '../validators';
import { validate } from '../middlewares/validate';

const UserRouter = express.Router();

UserRouter.get('/', UserController.getUsers);
UserRouter.get('/:id', UserController.getUser);
UserRouter.post('/', validate(UserValidator.createUserSchema), UserController.createUser);
UserRouter.put('/:id', validate(UserValidator.updateUserSchema), UserController.updateUser);
UserRouter.delete('/:id', UserController.deleteUser);

export default UserRouter;