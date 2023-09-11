
import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const followArtist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }


    const { artistName } = req.params;


    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { followedArtists: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const alreadyFollowed = user.followedArtists.some((artist) => artist.artist === artistName);

    if (alreadyFollowed) {
      return res.json({ message: `Ya sigues al artista: ${artistName}` });
    }

   
    await prisma.followartist.create({
      data: {
        artist: artistName,
        user: { connect: { id: userId } }, 
      },
    });

    return res.json({ message: `Ahora sigues al artista: ${artistName}` });
  } catch (error) {
    console.error('Error al seguir al artista', error);
    res.status(500).json({ error: 'Error al seguir al artista' });
  }
}


export const unfollowArtist = async (req: Request, res: Response) => {
  try {
    const { artistName } = req.params;
    const userId = 1; // Aquí deberías obtener el ID del usuario autenticado, puede ser desde el token de autenticación o desde otra fuente

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { followedArtists: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const followedArtist = user.followedArtists.find((artist) => artist.artist === artistName);

    if (!followedArtist) {
      return res.json({ message: `No sigues al artista: ${artistName}` });
    }

    await prisma.followartist.delete({
      where: { id: followedArtist.id },
    });

    return res.json({ message: `Dejaste de seguir al artista: ${artistName}` });
  } catch (error) {
    console.error('Error al dejar de seguir al artista', error);
    res.status(500).json({ error: 'Error al dejar de seguir al artista' });
  }
}