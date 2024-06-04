import mongoose from "mongoose";

interface MongoOptions {
  mongoUri: string,
  dbName: string,
}

export class MongoDatabase {

  public static async connect( { mongoUri, dbName }: MongoOptions ): Promise<boolean> {

    try {
      await mongoose.connect( mongoUri, { dbName } )
      console.log('MongoDB is connected');
      return true;
    } catch (error) {
      console.log(`${ error }`);
      return false;
    }

  }

  public static async disconnect() {
    await mongoose.disconnect();
  }

}