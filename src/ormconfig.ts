import { ConnectionOptions } from "typeorm";

const config: ConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "mediumclone",
    password: "welcome123",
    database: "mediumclone",
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
    cli: {
        migrationsDir: __dirname + "/migrations"
    }
};

export default config;