import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
    databaseUrl: string;
    databaseName: string;
}

interface Config {
    frontendOrigin: string;
    port: number;
    nodeEnv: string;
    jwtTokenSecretKey: string;
    database: DatabaseConfig;
}

const config: Config = {
    frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:8081',
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtTokenSecretKey: process.env.JWT_TOKEN_SECRET_KEY || 'examroomallotmentdb',
    database: {
        databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017',
        databaseName: process.env.DATABASE_NAME || 'examroomallotmentdb'
    }
};

export default config;