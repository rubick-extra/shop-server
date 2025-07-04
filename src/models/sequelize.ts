import { Sequelize } from 'sequelize';
import path from 'path';

// 单例实例
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), './database/data.sqlite')
});

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((err) => {
  console.error('Unable to connect to the database:', err);
});

export default sequelize;
