import bcrypt from "bcrypt";
import { getEnvVar } from "./getEnvVar.js";

export default class CredentialsProvider {
  // Pass the mongoClient in once when the app starts
  constructor(mongoClient) {
    this.db = mongoClient.db();
    this.credsCollection = this.db.collection(
      getEnvVar("CREDS_COLLECTION_NAME") || "userCreds",
    );
    this.usersCollection = this.db.collection("users");
  }

  async registerUser(username, email, password) {
    // 1. Check if the username already exists
    const existingUser = await this.credsCollection.findOne({ username });
    if (existingUser) return false;

    // 2. Hash and salt (bcrypt handles the salt automatically inside the hash string)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Save to both collections
    await this.credsCollection.insertOne({
      username,
      password: hashedPassword,
    });
    await this.usersCollection.insertOne({ username, email });

    return true;
  }

  async verifyPassword(username, plaintextPassword) {
    const userCreds = await this.credsCollection.findOne({ username });
    if (!userCreds) return false;

    // 3. Compare plaintext to the hashed string
    return await bcrypt.compare(plaintextPassword, userCreds.password);
  }
}
