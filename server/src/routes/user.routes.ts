import { Router } from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/user-auth.controller';
import { validateRequest } from '../middlewares/validaterequest';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/forgotpassword', validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/resetpassword', validateRequest(resetPasswordSchema), resetPassword)




export default router;