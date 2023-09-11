import { Router} from "express";
import { createUser, logoutUser } from "../Controllers/userController";
import { loginUser } from "../Controllers/userController";
import { deleteUser } from "../Controllers/userController";
import { getUser } from "../Controllers/userController";


export const userRouter=Router();

userRouter.post('/NewUser',createUser);
userRouter.post('/Login',loginUser);
userRouter.get('/:userId',getUser);
userRouter.delete('/:userId',deleteUser);
userRouter.post('/logout',logoutUser);