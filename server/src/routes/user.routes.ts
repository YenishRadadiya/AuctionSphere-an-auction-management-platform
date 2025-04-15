import { Router } from 'express';
import { register, login } from '../controllers/user-auth.controller';
import { validateRequest } from '../middlewares/validaterequest';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

export default router;