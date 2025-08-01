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
  dependencies: {
    type: DataTypes.JSON
  },
  description: {
    type: DataTypes.STRING
  },
  development: {
    type: DataTypes.STRING
  },
  entry: {
    type: DataTypes.STRING
  },
  features: {
    type: DataTypes.JSON
  },
  homePage: {
    type: DataTypes.STRING
  },
  keywords: {
    type: DataTypes.JSON
  },
  latestVersion: {
    type: DataTypes.STRING
  },
  license: {
    type: DataTypes.STRING
  },
  logo: {
    type: DataTypes.STRING
  },
  main: {
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
  preload: {
    type: DataTypes.STRING
  },
  readme: {
    type: DataTypes.TEXT
  },
  scripts: {
    type: DataTypes.JSON
  },
  source: {
    type: DataTypes.STRING
  },
  versions: {
    type: DataTypes.JSON
  },
  volta: {
    type: DataTypes.STRING
  }
});

export { Plugin };