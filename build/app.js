import express from "express";

const port = process.env.PORT || 3001;


import cors from "cors";
import{followRouter}from"../src/Rutes/followRutes.ts"
import { userRouter } from "../src/Rutes/userRutes.ts";
import { PrismaClient } from "@prisma/client";
import { playlistRouter } from "../src/Rutes/playlistRuter.ts";
import {albumesSeed,albumesDelete} from'./Albumes/albunesSeed';
import{searchRouter}from'../src/Rutes/searchRoutes.ts';
import albumRouter from'../src/Rutes/albumRoutes.ts';
import'./AuthMiddleware/authinter';
import cookieParser from'cookie-parser'
import { logoutUser } from "../src/Controllers/userController";

const prisma= new PrismaClient();

const app =express();

const PORT=process.env.PORT||2600

app.use(express.json());
 
  app.use(cors({
    credentials: true, 
    origin: 'http://localhost:3001',
  }));


app.use("/users",userRouter);
app.use("/playList",playlistRouter);
app.use("/ArtistFollow",followRouter)
app.use ("/Search",searchRouter)
app.use('/api/albums', albumRouter);
app.use('/logout',logoutUser);



 app.use(cookieParser(



 ));
const backInit= async()=> {
  try {
  
 await prisma.$connect();
 

  app.listen(PORT, () => {
    
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
  }
}

backInit();

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

