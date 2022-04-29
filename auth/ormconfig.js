module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/app/entities/*{.ts,.js}'],
  seeds: ['dist/database/seeds/*{.ts,.js}'],
  factories: ['dist/database/factories/*{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  /*subscribers: ["dist/app/subscribers/!**!/!*{.ts,.js}"],*/
  autoLoadEntities: true,
  migrationsRun: false,
  synchronize: true,
  logging: false,
  cli: {
    entitiesDir: 'src/app/entities',
    migrationsDir: 'src/database/migrations',
    subscribersDir: 'src/app/subscribers',
  },
};
