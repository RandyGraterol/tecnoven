const intervaForm = document.getElementById('intervaForm');
intervaForm.addEventListener('submit',e=>{
e.preventDefault();

const intervalo = document.getElementById('intervalo').value;

fetch('/configuracion',{
	method:'POST',
	headers:{
		"Content-Type":"application/json"
	}, body:JSON.stringify({intervalo})
})
.then(res=>res.json())
.then(res=>{
	if(res.status){
		Swal.fire('¡Configuración Interval cambiada con exito!').then(()=>{
			window.location.href='/dashboard';
		})
	}else{
		Swal.fire('¡No se pudo cambiar la configuracion interval!');
	}
})

	
});