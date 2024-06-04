import { MongoDatabase } from './data/mongo-db/init';
import { AppRouter } from './presentation/routes';
import { Server } from './presentation/server';
import { envs } from './config';

(async () => {
  await main();
})();

async function main() {
  await MongoDatabase.connect({
    mongoUri: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });

  const server = new Server({
    port: envs.PORT,
    router: AppRouter.routes,
  });

  await server.start();
}
