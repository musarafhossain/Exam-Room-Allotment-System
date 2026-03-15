import express from 'express';
import { UserController } from '../controllers';
import { UserValidator } from '../validators';
import { validate } from '../middlewares/validate';
import verifyJwtToken from '../middlewares/verifyJwtToken';

const UserRouter = express.Router();

UserRouter.get('/', verifyJwtToken, UserController.getUsers);
UserRouter.get('/:id', verifyJwtToken, UserController.getUser);
UserRouter.post('/', verifyJwtToken, validate(UserValidator.createUserSchema), UserController.createUser);
UserRouter.put('/:id', verifyJwtToken, validate(UserValidator.updateUserSchema), UserController.updateUser);
UserRouter.delete('/:id', verifyJwtToken, UserController.deleteUser);

export default UserRouter;