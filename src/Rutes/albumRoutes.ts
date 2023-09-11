import express from 'express';
import { getAlbums } from './../Controllers/albumController'

const albumsRouter = express.Router();

albumsRouter.get('/:id?', async (req, res) => {
  const { id } = req.params;
  const idAsNumber = id ? parseInt(id) : undefined;

  try {
    const albums = await getAlbums(idAsNumber);

    if (!albums || albums.length === 0) {
      res.status(404).json({ message: 'No albums found' });
    } else {
      res.json(albums);
    }
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default albumsRouter;