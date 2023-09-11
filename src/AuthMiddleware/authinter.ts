import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
const prisma = new PrismaClient();
const Password = 'passwordtoken';


declare global {
    namespace Express {
      interface Request {
        user?: User; 
      }
    }
  }

  export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization|| '';
      if (!authorizationHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token no válido' });
      }
  
      const token = authorizationHeader.replace('Bearer ', '').trim(); 
  
      const decoded = jwt.verify(token, Password) as JwtPayload;
      const userId = decoded.id;
  
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          playlists: true,
          followedArtists: true,
        },
      });
  
      if (!user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }
  
      req.user = user; 
  
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  };