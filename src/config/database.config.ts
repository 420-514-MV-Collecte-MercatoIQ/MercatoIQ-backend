import { ConfigService } from "@nestjs/config";
import { MongooseModuleFactoryOptions } from "@nestjs/mongoose";

export const getMongooseConfig = (
  configService: ConfigService,
): MongooseModuleFactoryOptions => ({
  uri:
    configService.get<string>("MONGO_URI") ||
    "mongodb://admin:mercatoiq_dev_pass@localhost:27017/mercatoiq?authSource=admin",
  dbName: configService.get<string>("MONGO_DB_NAME") || "mercatoiq",
});
