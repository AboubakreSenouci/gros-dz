declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      BASE_URL: string;
      AUTH_SECRET: string;
      BETTER_AUTH_SECRET: string;
      BETTER_AUTH_URL: string;
      DATABASE_URL: string;
      DIRECT_URL: string;
      META_ACCESS_TOKEN: string;
      RESEND_API_KEY: string;
      WHATSAPP_API: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}