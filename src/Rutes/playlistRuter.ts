import { Router } from "express";
import { addToPlaylist, createPlaylist,deletePlaylist,deleteTrack,getPlaylists } from "../Controllers/playListcontroller";
import { AuthMiddleware } from "../AuthMiddleware/authinter";


export const playlistRouter=Router();


playlistRouter.post('/newPlaylist',AuthMiddleware, createPlaylist);
playlistRouter.delete('/:playlistId', deletePlaylist);
playlistRouter.delete('/:playlistId/deletetrack/:songId',  deleteTrack);
playlistRouter.get('/:Userplaylists', AuthMiddleware, getPlaylists)
playlistRouter.post('/addToPlaylist',AuthMiddleware,addToPlaylist)