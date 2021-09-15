let dbconfig = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [
    'src/models/*.{ts,js}',
  ],
  migrations: [
    'src/database/migration/*.{ts,js}',
  ],
  cli: {
    entitiesDir: 'src/models',
    migrationsDir: 'src/database/migration',
  },
};

if (process.env.NODE_ENV !== 'dev') {
  dbconfig = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [
      'dist/models/*.{ts,js}',
    ],
    migrations: [
      'dist/database/migration/*.{ts,js}',
    ]
  }
  dbconfig.ssl = true;
  dbconfig.extra = {
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

module.exports = dbconfig;
