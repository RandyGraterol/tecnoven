const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Canal = sequelize.define('canales', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre del canal no puede estar vacío'
      },
      len: {
        args: [2, 100],
        msg: 'El nombre debe tener entre 2 y 100 caracteres'
      }
    }
  },
  ip: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      isIP: {
        msg: 'Debe proporcionar una dirección IP válida'
      },
      notEmpty: {
        msg: 'La dirección IP no puede estar vacía'
      }
    }
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estado: {
    type: DataTypes.ENUM('activo', 'inactivo', 'mantenimiento'),
    allowNull: false,
    defaultValue: 'activo'
  },
  ultima_comprobacion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  latencia: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'La latencia no puede ser negativa'
      }
    }
  },
  umbral_alerta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 500, // ms
    validate: {
      min: {
        args: [100],
        msg: 'El umbral de alerta debe ser al menos 100ms'
      }
    }
  }
}, {
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
  freezeTableName: true,
  tableName: 'canales',
  paranoid: true, // Para eliminación lógica
  underscored: true, // Para usar snake_case en los nombres de columnas
  indexes: [
    {
      unique: true,
      fields: ['ip'],
      name: 'uq_canales_ip'
    },
    {
      fields: ['estado'],
      name: 'idx_canales_estado'
    }
  ]
});

module.exports = Canal;