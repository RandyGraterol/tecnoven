const formulario = document.getElementById('formulario');

formulario.addEventListener('submit',e=>{
	e.preventDefault();

	const nombre = document.getElementById("nombre").value;
	const ip = document.getElementById("ip").value;
	const descripcion = document.getElementById("descripcion").value;
	const estado = document.getElementById("estado").value;
	const latencia = document.getElementById("latencia").value;
	const umbral_alerta = document.getElementById("umbral_alerta").value;

	fetch('/registerCanalPost',{
		method:'POST',
		headers:{
			"Content-Type":"application/json"
		},
		body:JSON.stringify({nombre,ip,descripcion,estado,latencia,umbral_alerta})
	})
	.then(res=>res.json())
	.then(res=>{
		if(res.status){
		Swal.fire('¡Canal Registrado!');
		formulario.reset();
		return;
		}
		Swal.fire('¡No se pudo registrar el canal!');
	})
});