import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule, getModelToken, MongooseModuleOptions } from '@nestjs/mongoose';

let mongod;
export const mongoDbServerModule = () =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = await MongoMemoryServer.create();
      const uri = await mongod.getUri();
      return {
        uri: uri,
      };
    },
  });

export const mongoDbRealServerModule = () => MongooseModule.forRoot(process.env.MONGODB_ATLAS);

export const mongoDbServerCleanup = async () => {
  await mongod.cleanup();
};
export const mongoDbServerStop = async () => {
  await mongod.stop();
};
