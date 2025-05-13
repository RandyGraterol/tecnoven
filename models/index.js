const Canal = require('./canal');
const Alerta = require('./alerts');
const Usuarios = require('./usuarios');
const Configuracion = require('./configuracion.js');

Canal.hasMany(Alerta,{foreignKey:'canal_id'});
Alerta.belongsTo(Canal,{foreignKey:'canal_id'});

module.exports = {Canal, Alerta,Usuarios,Configuracion};
