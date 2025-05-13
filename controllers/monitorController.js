const { Canal, Alerta,Usuarios,Configuracion} = require('../models');
const { checkCanales } = require('../utils/pingHelper');
const transporter = require('../config/mailer');
const ping = require('ping');

exports.dashboar = async (req, res) => {
  res.render('dashboard', {
    noSidebar: false,
    activePage: 'dashboard',
    title: '¡Bienvenido a Alert IP Watchar!',
    user: { name:req.session.usuario}
  });
};
exports.allClear = async(req,res)=>{
try{
const data = await Alerta.findAll();
if(data.length <= 0) return res.json({status:null,message:'¡No hay registros que eliminar!'}); 
await Alerta.destroy({where:{},truncate:true});
res.json({status:true,message:'¡Reportes eliminados!'});
}catch(error){
console.error('Error al Limpiar todos los registros de la tabla reportes:', error);
res.status(500).json({status:false,message:'Error interno del servidor'});
}
}
exports.statusVerify = async(req,res)=>{
  try{
   const ip = req.params.ip; 
   const canal = await Canal.findOne({where:{ip}});
   const response = await ping.promise.probe(ip,{ timeout: 3 });
   res.json({status:true,canal,isAlive:response.alive}); 
 }catch(error){
   console.error('Error al obtener Estado:', error);
   res.status(500).send('Error interno del servidor'); 
 }
}
exports.alerts = async(req,res)=>{
  try{
   const alert = await Alerta.findAll();
   const alertas = alert.reverse();
   res.render('alerts', {
    noSidebar:true,
    title: 'Listado de alertas',
    activePage: 'alerts',
    alertas,
    user: { name:req.session.usuario}
  });
 }catch(error){
  console.error('Error al obtener reportes:', error);
  res.status(500).send('Error interno del servidor');
}
}

exports.verCanales = async (req, res) => {
  try {
    const chanels = await Canal.findAll();
    const canales = chanels.reverse();
    res.render('canales', {
      noSidebar:true,
      title: 'Listado de canales',
      activePage: 'canales',
      canales,
      user: { name:req.session.usuario}
    });
  } catch (error) {
    console.error('Error al obtener los canales:', error);
    res.status(500).send('Error interno del servidor');
  }
};

exports.registerCanal = (req,res)=>{
  try{
    res.render('form/canal', {
      noSidebar:false,
      title: 'Registrar Canal',
      activePage: 'dashboard',
      user: { name:req.session.usuario}
    });
  }catch(error){
   console.error('Error al obtener plantilla form canal:', error);
   res.status(500).send('Error interno del servidor');
 }
}
exports.registerUsuario = (req,res)=>{
  try{
    res.render('form/usuario', {
      noSidebar:false,
      title: 'Registrar Usuario',
      activePage: 'dashboard',
      user: { name:req.session.usuario}
    });
  }catch(error){
   console.error('Error al obtener plantilla form canal:', error);
   res.status(500).send('Error interno del servidor');
 }
}

exports.registerCanalPost = async(req,res)=>{
  const {nombre,ip,descripcion,estado,latencia,umbral_alerta} = req.body;
  try{
    await Canal.create({nombre,ip,descripcion,estado,latencia,umbral_alerta});
    res.json({status:true,message:'Canal creado con exito'});
  }catch(error){
   console.error('Error al registrar canal:', error);
   res.status(500).json({status:false,message:'Error interno del servidor'});
 }
}

exports.registerUsuarioPost = async(req,res)=>{
  const {nombreU,apellidoU,emailU,passwordU,rolU,activoU,ultimo_accesoU} = req.body;
  try{
    await Usuarios.create({nombre:nombreU,apellido:apellidoU,email:emailU,password:passwordU,rol:rolU,activo:activoU,ultimo_acceso:ultimo_accesoU});
    res.json({status:true,message:'Usuario creado con exito'});
  }catch(error){
    console.error('Error al Registrar Usuario:', error);
    res.status(500).json({status:false,message:'Error interno del servidor'});
  }
}

exports.updateUserGet = async(req,res)=>{
  const id = req.params.id;
  try{
   const data = await Usuarios.findOne({where:{id}});
   if(!data) return res.json({status:null,message:'No se encontro usuario'});
   res.render('update',{
    tabla:'Usuario',
    data,
    noSidebar:false,
    title: 'Listado de Usuarios',
    activePage: 'usuarios',
    user: { name:req.session.usuario}

  });
 }catch(error){
   console.error('Error al mostrar plantilla actualizar:', error);
   res.status(500).json({status:false,message:'Error interno del servidor'});
 }
}

exports.updateCanalGet = async(req,res)=>{
  const id = req.params.id;
  try{
    const data = await Canal.findOne({where:{id}});
    if(!data) return res.json({status:null,message:'No se encontro Canal'});
    res.render('update',{
      tabla:'Canal',
      data,
      noSidebar:false,
      title: 'Listado de canales',
      activePage: 'canales',
      user: { name:req.session.usuario}

    });
  }catch(error){
    console.error('Error al mostrar plantilla actualizar:', error);
    res.status(500).json({status:false,message:'Error interno del servidor'});
  }
}

exports.updatePut = async(req,res)=>{
  const id = req.params.id;
  const tabla = req.params.tabla;
  
  try{
    if(tabla == 'Usuario'){
      const {nombreUsuario,apellidoUsuario,emailUsuario,passwordUsuario,rolUsuario,activoUsuario,ultimo_accesoUsuario} = req.body;
      await Usuarios.update({nombre:nombreUsuario,apellido:apellidoUsuario,email:emailUsuario,password:passwordUsuario,rol:rolUsuario,activo:activoUsuario,ultimo_acceso:ultimo_accesoUsuario},{where:{id}});
    }else{
      const {nombre,ip,descripcion,estado,latencia,umbral_alerta} = req.body;
      await Canal.update({nombre,ip,descripcion,estado,latencia,umbral_alerta},{where:{id}});
    }
    res.json({status:true,message:`¡${tabla} Actualizado!`});
  }catch(error){
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({status:false,message:'Error interno del servidor'});
  }
}

exports.delete= async(req,res)=>{
  const id = req.params.id;
  const tabla = req.params.tabla;
  try{
    if(tabla== 'Usuario'){
     await Usuarios.destroy({where:{id}});
   }else{
    await Canal.destroy({where:{id}});
  }
  res.json({status:true,message:`¡${tabla} eliminado!`});
}catch(error){
  console.error('Error al eliminar usuario:', error);
  res.status(500).json({status:false,message:'Error interno del servidor'});
}
}

exports.usuarios = async (req,res)=>{
  try{
   const users = await Usuarios.findAll();
   res.render('usuarios', {
    noSidebar:true,
    title: 'Listado de Usuarios',
    activePage: 'usuarios',
    users,
    user: { name:req.session.usuario}
  });
 }catch(error){
   console.error('Error al obtener usuarios:', error);
   res.status(500).json({status:false,message:'Error interno del servidor'});
 }
}

exports.auth = (req,res)=>{
  try{
    res.render('auth/auth',{layout:false});
  }catch(error){
    console.error('Error al obtener plantilla auth:', error);
    res.status(500).json({status:false,message:'Error interno del servidor'});
  }
}

exports.login = async(req,res)=>{
  const {usuario,password} = req.body;
  try{
    const user = await Usuarios.findOne({where:{nombre:usuario,password}});
    if(!user) return res.json({status:null,message:'¡Usuario o contraseña Incorrecto!'});
    req.session.isAdmin =true;
    req.session.usuario = `${user.rol}: ${user.nombre} ${user.apellido}`;
    res.json({status:true,message:'¡Inicio de sesion correcto!'});
  }catch(error){
    console.error('Error al iniciar sesion:', error);
    res.status(500).json({status:false,message:'Error interno del servidor'});
  }
}

exports.logout=async(req, res) => {
  try{
   req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.json({status:false,message:'error al cerrar sesion',error:err});
    }
    res.clearCookie('connect.sid'); // Borra la cookie de sesión si usas la predeterminada
    res.redirect('/'); // Redirige a la página de login u otra que quieras
  }); 
 }catch(error){
   console.error('Error al cerrar sesion:', error);
   res.status(500).json({status:false,message:'Error interno del servidor'});
 }
}

// Mostrar la vista con el valor actual
exports.getConfiguracion = async (req, res) => {
  const config = await Configuracion.findOne({ where: { clave: 'intervalo_ping' } });
  const intervalo = config ? config.valor : 10;
  res.render('configuracion', { 
    intervalo, 
    noSidebar:true,
    title: 'Configuracion de Intervalos',
    activePage: 'configuracion',
    user: { name:req.session.usuario}});
};

// Actualizar valor desde el formulario
exports.postConfiguracion = async (req, res) => {
  try{
    const nuevoValor = req.body.intervalo || '10';
    await Configuracion.upsert({ clave: 'intervalo_ping', valor: nuevoValor });
    res.json({status:true});
  }catch(error){
   console.error('Error al cambiar interval:', error);
   res.status(500).json({status:false,message:'Error interno del servidor'});
 }

};

// Obtener el valor actual programáticamente
exports.getIntervaloEnMilisegundos = async () => {
  const config = await Configuracion.findOne({ where: { clave: 'intervalo_ping' } });
  const minutos = parseInt(config?.valor || '10');
  return minutos * 60 * 1000;
};

exports.checkStatus = async () => {
  try {
    const canales = await Canal.findAll(); // Incluye los que estén marcados en mantenimiento
    const resultados = await checkCanales(canales);

    for (let resultado of resultados) {
      const canal = resultado.canal;
      const estaEnMantenimiento = canal.estado === 'mantenimiento';
      const mensajeBase = `Canal "${canal.nombre}"`;

      let mensaje = '';
      let tipo = '';
      let urgencia = '';

      // Canal marcado en mantenimiento manualmente
      if (estaEnMantenimiento) {
        mensaje = `${mensajeBase} está marcado en mantenimiento por el operador.`;
        tipo = 'advertencia';
        urgencia = 'baja';
      }
      // Canal no responde al ping
      else if (!resultado.isAlive) {
        mensaje = `${mensajeBase} está inactivo (no responde al ping).`;
        tipo = 'error';
        urgencia = 'alta';

        // Opción: Actualizar estado del canal si quieres persistirlo
        await canal.update({ estado: 'inactivo' });
      }
      // Canal responde al ping normalmente
      else {
        mensaje = `${mensajeBase} está activo y funcionando correctamente.`;
        tipo = 'informacion';
        urgencia = 'baja';

        // Opción: actualizar estado
        await canal.update({ estado: 'activo' });
      }
      let tipoo = tipo == 'error' ? 'inactivo' : tipo == 'informacion' ? 'activo' : 'mantenimiento';

      // Guardar alerta
      await Alerta.create({
        canal_id: canal.id,
        type: tipo,
        mensaje,
        estado:tipoo,
        urgencia
      });

      // Enviar correo
      await transporter.sendMail({
        from:'tecnovenca2@gmail.com',
        to:'nateratarea@gmail.com',
        subject: `Reporte de Canal: ${canal.nombre}`,
        text: mensaje
      });

      console.log(`[${new Date().toLocaleString()}] ${mensaje}`);
    }
  } catch (error) {
    console.error('Error al ejecutar el monitoreo:', error);
  }
};


