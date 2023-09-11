import express from "express";
import cors from "cors";
import { followRouter } from "./Rutes/followRutes";
import { userRouter } from "./Rutes/userRutes";
import { PrismaClient } from "@prisma/client";
import { playlistRouter } from "./Rutes/playlistRuter";
import {albumesSeed,albumesDelete} from'./Albumes/albunesSeed';
import{searchRouter}from'./Rutes/searchRoutes';
import albumRouter from'./Rutes/albumRoutes';
import'./AuthMiddleware/authinter';
import cookieParser from'cookie-parser'
import { logoutUser } from "./Controllers/userController";

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