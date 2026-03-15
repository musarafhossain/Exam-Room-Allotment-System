import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
    databaseUrl: string;
    databaseName: string;
}

interface Config {
    port: number;
    nodeEnv: string;
    database: DatabaseConfig;
}

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017',
        databaseName: process.env.DATABASE_NAME || 'examroomallotmentdb'
    }
};

export default config;