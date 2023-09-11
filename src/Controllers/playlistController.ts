import { PrismaClient } from "@prisma/client";
import {Request,Response} from 'express';

const prisma=new PrismaClient();

export const createPlaylist = async (req: Request, res: Response) => {
  try {
  const userId = req.user?.id;

if (!userId) {
 return res.status(401).json({ error: 'No se inició sesión' });
  }

const { nombre, albumId, songId } = req.body;
   
    console.log('Received songIds:', songId);
    const existingPlaylist = await prisma.playlist.findFirst({
      where: {
        usuarioId: userId,
        nombre,
      },
    });

    
if (existingPlaylist) {
 const updatedPlaylist = await prisma.playlist.update({
 where: { id: existingPlaylist.id },
 data: {
songs: {
   connect: songId.map((songId: number) => ({ id: songId })),
          },
        },
      });

      return res.json(updatedPlaylist);
    }

    const playlist = await prisma.playlist.create({
      data: {
        nombre,
        usuario: { connect: { id: userId } },
        songs: {
          connect: songId.map((songId: number) => ({ id: songId })),
        },
        album: albumId ? { connect: { id: albumId } } : undefined,
      },
    });

    return res.json(playlist);
  } catch (error) {
    console.error('Error al crear playlist', error);
    res.status(500).json({ error: 'Error al crear la playlist' });
  }
};



  export const deletePlaylist= async (req:Request,res:Response)=>{
 try{
const {playlistId}=req.params;

const existingPlaylist= await prisma.playlist.findUnique({
where:{id:parseInt(playlistId)},

});
if(!existingPlaylist){
return res.status(404).json({error:'Playlist No encontrada'
});
}


await prisma.playlist.delete({

where:{id:Number(playlistId)}

});
return res.json({message:'Playlist eliminada '});

}catch (error){
console.error('Error al eliminar la playlist',error);
res.status(500).json({error:'error al eliminar la playlist'})


}
};

export const deleteTrack= async(res:Response,req:Request)=>{
try{
const{playlistId,songId}=req.params;
await prisma.playlist.update({
    where: { id: Number(playlistId) },
    data: {
      songs: {
        disconnect: { id: Number(songId) },
      },
    },

});
return res.json({message:'tema eliminado de playlist '})

}
catch(error){
console.error('Error al eliminar tema', error)
res.status(500).json({ error: 'error al eliminar tema '});
}

}

export const getPlaylists = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const playlists = await prisma.playlist.findMany({
      where: {
        usuarioId: userId,
      },
      include: {
        songs: true,
        album:true
      },
    });

    return res.json(playlists);
  } catch (error) {
    console.error('Error al obtener las playlists del usuario', error);
    res.status(500).json({ error: 'Error al obtener las playlists del usuario' });
  }
};

export const addToPlaylist = async (req:Request, res:Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'No se inició sesión' });
    }

    const { playlistName, songId } : { playlistName: string; songId: number[] } = req.body;

    const existingPlaylist = await prisma.playlist.findFirst({
      where: {
        usuarioId: userId,
        nombre: playlistName,
      },
    });

    if (!existingPlaylist) {
      return res.status(404).json({ error: 'Playlist no encontrada' });
    }

    const updatedPlaylist = await prisma.playlist.update({
      where: { id: existingPlaylist.id },
      data: {
        songs: {
          connect: songId.map((songId) => ({ id: songId })),
        },
      },
      include:{
        songs: {
          include: {
            album: true,

          
          }  
        }
      }
    });
    const songs = updatedPlaylist.songs.map((song) => {
      return {
        ...song,
        album: song.album, 
      };
    });
    
   
    const updated = {
      ...updatedPlaylist,
      songs: songs, 
    };
    
    return res.json(updated); 
  
    } catch (error) {
    console.error('Error al añadir a la playlist', error);
    res.status(500).json({ error: 'Error al añadir a la playlist' });
  }
};








