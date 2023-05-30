import express from 'express';
import { start } from 'repl';
import config from './config/index';
import expressLoader from './loaders/expressLoader';
const { port } = config || 3000;
const app = express();

async function startServer() {
  expressLoader(app)
    .then((expressApp) => {
      expressApp.listen(port, () => {
        console.log(`Server is running on ${port}`);
      });
    })
    .catch((error) => {
      console.error('Error occurred during Express loader initialization:', error);
      process.exit(1);
    });
}

startServer();
