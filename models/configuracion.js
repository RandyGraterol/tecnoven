const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Configuracion = sequelize.define('configuracion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  clave:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  valor:{
    type: DataTypes.STRING,
    allowNull: false
  }
},{
  tableName: 'configuracion',
  timestamps: false
});

module.exports = Configuracion;
