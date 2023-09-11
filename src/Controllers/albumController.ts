import { Album, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAlbums = async (id?: number) => { 
  try {
    if (id !== undefined) { 
      const album = await prisma.album.findUnique({
        where: {
          id: id,
        },
        include: {
          songs: {
            select: {
              id:true,
              title: true,
            },
          },
        },
      });
      return album ? [album] : [];
    } else {
      const albums = await prisma.album.findMany({
        include: {
          songs: {
            select: {
              id:true,
              title: true,
            },
          },
        },
      });
    
    
    const albumsSong = albums.map((album) => ({
      ...album,
      songIds: album.songs.map((song) => song.id),
    }));

    return albumsSong;
  }

  } catch (error) {
    console.error('Error fetching albums:', error);
    throw new Error('Internal server error');
  } finally {
    await prisma.$disconnect();
  }
};