const formularioUsuario = document.getElementById('formularioUsuario');

formularioUsuario.addEventListener('submit',e=>{
	e.preventDefault();

	const nombreU = document.getElementById("nombre").value;
	const apellidoU = document.getElementById("apellido").value;
	const emailU = document.getElementById("email").value;
	const passwordU = document.getElementById("password").value;
	const rolU = document.getElementById("rol").value;
	const activoU = document.getElementById("activo").value;
	const ultimo_accesoU = document.getElementById("ultimo_acceso").value;

	fetch('/registerUsuarioPost',{
		method:'POST',
		headers:{
			"Content-Type":"application/json"
		},
		body:JSON.stringify({nombreU,apellidoU,emailU,passwordU,rolU,activoU,ultimo_accesoU})
	})
	.then(res=>res.json())
	.then(res=>{
		if(res.status){
		Swal.fire('¡Usuario Registrado!');
		formularioUsuario.reset();
		return;
		}
		Swal.fire('¡No se pudo registrar el Usuario!');
	})
});

