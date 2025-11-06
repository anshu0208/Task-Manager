import express from 'express';
import { getCurrentUser, loginUser, registerUser, updatePassword, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

 const router = express.Router();

   // Public Links
   router.post('/register', registerUser);
   router.post('/login', loginUser);

   //PRIVATE LINKS
   router.get('/me',authMiddleware, getCurrentUser);
   router.put('/profile', authMiddleware,updateProfile);
   router.put('/password',authMiddleware, updatePassword);

   export default router;