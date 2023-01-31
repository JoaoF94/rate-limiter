import http from 'http';
import express, { Express } from 'express';
import routes from './routes/requests';

const server: Express = express();

/** Routes */
server.use('/', routes);

/** Error handling */
server.use((req, res, next) => {
  const error = new Error('not found');
  return res.status(404).json({
    message: error.message
  });
});

/** Server */
const httpServer = http.createServer(server);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));