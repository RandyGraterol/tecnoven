const formularioUsuarioUpdate = document.getElementById('formularioUsuarioUpdate');

formularioUsuarioUpdate.addEventListener('submit',e=>{
	e.preventDefault();

	let nombreUsuario,apellidoUsuario,emailUsuario,passwordUsuario,rolUsuario,activoUsuario,ultimo_accesoUsuario,datos;

    const tabla = formularioUsuarioUpdate.dataset.tabla;

    if(tabla == 'Usuario'){
    nombreUsuario = document.getElementById("nombre").value;
	apellidoUsuario = document.getElementById("apellido").value;
	emailUsuario = document.getElementById("email").value;
	passwordUsuario = document.getElementById("password").value;
	rolUsuario = document.getElementById("rol").value;
	activoUsuario = document.getElementById("activo").value;
	ultimo_accesoUsuario = document.getElementById("ultimo_acceso").value;
	datos={
		nombreUsuario,
		apellidoUsuario,
		emailUsuario,
		passwordUsuario,
		rolUsuario,
		activoUsuario,
		ultimo_accesoUsuario
	}	
    }else{
    const nombre = document.getElementById("nombre").value;
	const ip = document.getElementById("ip").value;
	const descripcion = document.getElementById("descripcion").value;
	const estado = document.getElementById("estado").value;
	const latencia = document.getElementById("latencia").value;
	const umbral_alerta = document.getElementById("umbral_alerta").value;
	datos={
		nombre,
		ip,
		descripcion,
		estado,
		latencia,
		umbral_alerta
	}

    }
	
	const id = formularioUsuarioUpdate.dataset.id;
	

	fetch(`/updatePut/${id}/${tabla}`,{
		method:'PUT',
		headers:{
			"Content-Type":"application/json"
		},
		body:JSON.stringify(datos)
	})
	.then(res=>res.json())
	.then(res=>{
		if(res.status){
		Swal.fire(`¡${tabla} Actualizado!`);
		formularioUsuario.reset();
		return;
		}
		Swal.fire(`No se pudo actualizar el ${tabla}!`);
	})

});

