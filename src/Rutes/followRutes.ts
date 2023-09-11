import { followArtist} from "../Controllers/followController";
import { Router } from "express";
import { unfollowArtist } from "../Controllers/followController";
import { AuthMiddleware } from "../AuthMiddleware/authinter";


export const followRouter=Router();

followRouter.post('/followArtist',AuthMiddleware, followArtist);
followRouter.delete('/unfollowArtist/:artistName',unfollowArtist)