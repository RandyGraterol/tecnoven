const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Alerta = sequelize.define('alerts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
    canal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'canales', // Esto asume que tienes un modelo de Canales
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('error', 'advertencia', 'informacion'),
    allowNull: false,
    defaultValue: 'error'
  },
  mensaje: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'mantenimiento'),
    allowNull: false,
    defaultValue: 'pendiente'
  },
  urgencia: {
    type: DataTypes.ENUM('baja', 'media', 'alta'),
    allowNull: false,
    defaultValue: 'media'
  }
}, {
  timestamps: true, // Corrección: es timestamps, no timestamp
  createdAt: 'fecha_creacion', // Personaliza el nombre de la columna
  updatedAt: 'fecha_actualizacion',
  freezeTableName: true,
  tableName: 'alerts', // Nombre de tabla en la base de datos
  paranoid: true, // Para eliminación lógica
  underscored: true // Para usar snake_case en los nombres de columnas
});

module.exports = Alerta;