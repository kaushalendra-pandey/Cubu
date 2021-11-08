import { getConnectionOptions, createConnection } from "typeorm";
import { User } from "../entities/User";
import path from "path";
export const createTypeormConn = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return process.env.NODE_ENV === "production"
    ? createConnection({
      ...connectionOptions,
      url: process.env.DATABASE_URL,
      entities: [User],
      migrations: [path.join(__dirname, "./migrations/*")],
      name: "default"
    } as any)
    : createConnection({ ...connectionOptions, name: "default" });
};
