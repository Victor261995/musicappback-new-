import { Followartist, Playlist, PrismaClient } from "@prisma/client";
import {Request,Response} from 'express';
import { generateToken, comparePasswords } from './../AuthMiddleware/auth';

import bcrypt from 'bcrypt';

const prisma=new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { nombre, email, contrasena, playlist } = req.body;
    const usuarioExistente = await prisma.user.findFirst({
      where: { email},
    });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);


    const newUser = await prisma.user.create({
      data: {
        nombre,
        email,
        contrasena:hashedPassword,
      },
    });

    return res.json(newUser);
  } catch (error) {
    console.error('Error al crear usuario', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};
  
export const loginUser= async(req:Request,res:Response)=>{

try{
const{email,contrasena}=req.body;
const user= await prisma.user.findFirst({
where:{email:email},
include:{
playlists:true,
followedArtists:true
}

});

if (!user || !(await comparePasswords(contrasena, user.contrasena))) {
  return res.status(401).json({ error: 'Error en email o contrasena' });
}
const token = generateToken(user);
return res.json({ user, token });

}catch(error){
console.error('error al iniciar sesion', error);
res.status(500).json({error:'error al iniciar sesion'})


}
};




export const deleteUser=async(req:Request,res:Response)=>{
try{
const userId=parseInt(req.params.userId)
const usuarioExistente= await prisma.user.findUnique({
    where:{id:Number(userId)},
    include: {
      playlists: true,
      followedArtists: true,
    },
  });
if(!usuarioExistente){

return res.status(404).json({Error:'Usuario no encontrado'});
};
await prisma.playlist.deleteMany({ where: { usuarioId: userId } });
await prisma.followartist.deleteMany({ where: { userId } });

await prisma.user.delete({
where:{id:Number(userId)},
include:{playlists:true},


});

return res.json({message:'Usuario eliminado'});






}catch(error){
    console.error('Error al eliminar usuario', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }

}


interface User{
  id: number;
  nombre: string | null;
  email: string;
  followedArtists: Followartist[] | [];
  playlists: Playlist[] | [];
  messageFollowedArtists?: string;
  messagePlaylists?: string;
}

export const getUser= async (req: Request, res: Response) => {
  try {
  const { userId } = req.params;
  const user = await prisma.user.findUnique({
     where: { id: parseInt(userId) },
      include: {
        followedArtists: true,
        playlists: {
          include:{
songs:true,
album:true,

          }
      },
    }});

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const response: User = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      followedArtists: user.followedArtists || [],
      playlists: user.playlists || [],
    };
    if (user.followedArtists && user.followedArtists.length > 0) {
      response.followedArtists = user.followedArtists;
    } else {
      response.followedArtists = [];
      response.messageFollowedArtists = 'El usuario no sigue a ningún artista.';
    }

    if (user.playlists && user.playlists.length > 0) {
      response.playlists = user.playlists;
    } else {
      response.playlists = [];
      response.messagePlaylists = 'El usuario no tiene playlists creadas.';
    }

    
    return res.json(response);
    
  } catch (error) {
    console.error('Error  usuario ', error);
    res.status(500).json({ error: 'Error usuario ' });
  }
};

export const logoutUser = (req:Request, res:Response) => {
  try {
   
    res.cookie('token', '', { expires: new Date(0) });

  
    res.json({ message: 'Log out' });
  } catch (error) {
    console.error('Error log out:', error);
    res.status(500).json({ error: 'Error log out' });
  }
};






