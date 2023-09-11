import { Router } from "express";
import { search } from "../Controllers/SearchController";

export const searchRouter = Router();

searchRouter.get('/', async (req, res) => {
  try {
    await search(req, res);
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
});