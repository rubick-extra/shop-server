import sequelize from './sequelize';

export * from './plugins';

export function dbReady() {
  return sequelize.sync({ alter: true });
}