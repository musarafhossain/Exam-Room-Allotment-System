import express from 'express';
import { AuthController } from '../controllers';
import { AuthValidator } from '../validators';
import { validate } from '../middlewares/validate';
import verifyJwtToken from '../middlewares/verifyJwtToken';

const AuthRouter = express.Router();

AuthRouter.post('/login', validate(AuthValidator.loginSchema), AuthController.login);
AuthRouter.post('/logout', verifyJwtToken, AuthController.logout);
AuthRouter.get('/me', verifyJwtToken, AuthController.me);
AuthRouter.post('/forgot-password', validate(AuthValidator.forgotPasswordSchema), AuthController.forgotPassword);
AuthRouter.get('/reset-password', AuthController.resetPasswordForm);
AuthRouter.post('/reset-password', validate(AuthValidator.resetPasswordSchema), AuthController.resetPassword);

export default AuthRouter;