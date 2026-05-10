import dotenv from 'dotenv';

dotenv.config();

interface DatabaseConfig {
    databaseUrl: string;
    databaseName: string;
}

interface NodemailerConfig {
    user: string;
    pass: string;
}

interface Config {
    frontendOrigin1: string;
    frontendOrigin2: string;
    frontendOrigin3: string;
    port: number;
    nodeEnv: string;
    jwtTokenSecretKey: string;
    database: DatabaseConfig;
    nodemailer: NodemailerConfig;
}

const config: Config = {
    frontendOrigin1: process.env.FRONTEND_ORIGIN_1 || 'http://localhost:8081',
    frontendOrigin2: process.env.FRONTEND_ORIGIN_2 || 'http://localhost:8081',
    frontendOrigin3: process.env.FRONTEND_ORIGIN_3 || 'http://localhost:8081',
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtTokenSecretKey: process.env.JWT_TOKEN_SECRET_KEY || 'examroomallotmentdb',
    database: {
        databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017',
        databaseName: process.env.DATABASE_NAME || 'examroomallotmentdb'
    },
    nodemailer: {
        user: process.env.NODEMAILER_USER || '',
        pass: process.env.NODEMAILER_PASS || ''
    }
};

export default config;