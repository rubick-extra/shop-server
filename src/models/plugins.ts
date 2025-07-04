import sequelize from "./sequelize";
import { DataTypes } from "sequelize";

const Plugin = sequelize.define('Plugin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING
  },
  pluginName: {
    type: DataTypes.STRING
  },
  version: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  keywords: {
    type: DataTypes.STRING
  },
  author: {
    type: DataTypes.STRING
  },
  pluginType: {
    type: DataTypes.STRING
  },
  logo: {
    type: DataTypes.STRING
  }
})

export default Plugin;