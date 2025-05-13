const statusVerify = document.querySelectorAll('.statusVerify');
statusVerify.forEach(canal=>{
canal.addEventListener('click',()=>{
	const ip = canal.dataset.ip;
	fetch(`/statusVerify/${ip}`)
	.then(res=>res.json())
	.then(res=>{
		let estado= res.isAlive ? 'Activo' : 'Inactivo';
		if(res.status){
			Swal.fire(`
			DIRECCION IP: ${res.canal.ip}
			NOMBRE: ${res.canal.nombre}
			ESTADO: ${estado}
		`);
		}else{
			Swal.fire('Error al obtener estado del canal');
		}
	})
});
})
