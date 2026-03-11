import { MongoClient } from "mongodb";
import { getEnvVar } from "./getEnvVar.js";

export function connectMongo() {
  const MONGO_USER = getEnvVar("MONGO_USER");
  const MONGO_PWD = getEnvVar("MONGO_PWD");
  const MONGO_CLUSTER = getEnvVar("MONGO_CLUSTER");
  const DB_NAME = getEnvVar("DB_NAME");

  const connectionString = `mongodb+srv://${MONGO_USER}:${MONGO_PWD}@${MONGO_CLUSTER}/${DB_NAME}`;
  console.log("Attempting Mongo connection at cluster: " + MONGO_CLUSTER);

  return new MongoClient(connectionString);
}
