import { Router } from 'express';
import userApi from './users.js';
import adminApi from './admin.js';


let router = Router();
router.use('/user', userApi);
router.use('/admin', adminApi);
export default router;