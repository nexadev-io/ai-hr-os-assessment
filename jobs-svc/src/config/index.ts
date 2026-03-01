import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  node_env: process.env.NODE_ENV,
  node_env_pro: process.env.NODE_ENV_PRO as boolean | undefined,
  mongo_prod: process.env.MONGO_PROD,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
};
