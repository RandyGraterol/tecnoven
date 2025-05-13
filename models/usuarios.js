const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre no puede estar vacío'
      }
    }
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
      msg: 'Este correo electrónico ya está registrado'
    },
    validate: {
      isEmail: {
        msg: 'Debe proporcionar un correo electrónico válido'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [8, 100],
        msg: 'La contraseña debe tener al menos 8 caracteres'
      }
    }
  },
  rol: {
    type: DataTypes.ENUM('admin', 'soporte', 'supervisor'),
    allowNull: false,
    defaultValue: 'soporte'
  },
  ultimo_acceso: {
    type: DataTypes.DATE,
    allowNull: true
  },
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
  freezeTableName: true,
  tableName: 'usuarios',
  paranoid: true,
  underscored: true,
});


module.exports = Usuario;