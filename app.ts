import express from "express";

const port = process.env.PORT || 3001;


import cors from "cors";
import{followRouter}from"./src/Rutes/followRutes"
import { userRouter } from "./src/Rutes/userRutes";
import { PrismaClient } from "@prisma/client";
import { playlistRouter } from "./src/Rutes/playlistRuter";
import {albumesSeed,albumesDelete} from'./src/Albumes/albunesSeed.js';
import{searchRouter}from'./src/Rutes/searchRoutes';
import albumRouter from'./src/Rutes/albumRoutes';
import'./src/AuthMiddleware/authinter';
import cookieParser from'cookie-parser'
import { logoutUser } from "./src/Controllers/userController";

const prisma= new PrismaClient();

const server = express();

const PORT=process.env.PORT||2600

server.use(express.json());
 
  server.use(cors({
    credentials: true, 
    origin: 'http://localhost:3001',
  }));


server.use("/users",userRouter);
server.use("/playList",playlistRouter);
server.use("/ArtistFollow",followRouter)
server.use ("/Search",searchRouter)
server.use('/api/albums', albumRouter);
server.use('/logout',logoutUser);



 server.use(cookieParser(



 ));
const backInit= async()=> {
  try {
  
 await prisma.$connect();
 

  server.listen(PORT, () => {
    
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
  }
}

backInit();


