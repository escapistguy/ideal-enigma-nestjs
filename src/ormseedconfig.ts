import ormConfig from "@app/ormconfig";

const ormSeedConfig = {
    ...ormConfig,
    migrations: ['src/seeds/*.ts'],
    cli: {
        migrationsDir: 'src/seeds'
    }
};

export default ormSeedConfig;