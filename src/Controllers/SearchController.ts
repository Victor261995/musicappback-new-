
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const search = async (req: Request, res: Response) => {
  console.log('Received search request with searchTerm:', req.query.searchTerm);
  const searchTerm = req.query.searchTerm as string;

  try {
    const searchResult = await prisma.album.findMany({
      where: {
        OR: [
   { artista: { contains: searchTerm, mode: 'insensitive' } },
 { titulo: { contains: searchTerm, mode: 'insensitive' } },
 { genero: { contains: searchTerm, mode: 'insensitive' } },
          {
    songs: {
    some: {
   title: { contains: searchTerm, mode: 'insensitive' },
              },
            },
          },
        ],
      },
      select: {
        titulo: true,
        artista: true, 
        anio: true,    
        caratula: true,
        songs: {
          select: {
            title: true,
    },
     },    },
    });
    console.log('Search results:', searchResult);
    res.json(searchResult);
  } catch (error) {
    console.error('Error en la búsqueda', error);
    res.status(500).json({ error: 'Error en la búsqueda' });
  } finally {
    await prisma.$disconnect();
  }
};