import sequelize from "./sequelize";
import { DataTypes } from "sequelize";

const Plugin = sequelize.define('Plugin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
  },
  homepage: {
    type: DataTypes.STRING
  },
  keywords: {
    type: DataTypes.STRING
  },
  latestVersion: {
    type: DataTypes.STRING
  },
  logo: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING
  },
  pluginName: {
    type: DataTypes.STRING
  },
  pluginType: {
    type: DataTypes.STRING
  },
  readme: {
    type: DataTypes.TEXT
  },
  source: {
    type: DataTypes.STRING
  },
  versions: {
    type: DataTypes.STRING
  },
});

export { Plugin };