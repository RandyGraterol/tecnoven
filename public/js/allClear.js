const btn_limpiar = document.querySelector('.btn-limpiar');

btn_limpiar.addEventListener('click',()=>{
	Swal.fire({
  title: '¡Confirmar nuevamente!',
  text: `¿Estás seguro de que deseas eliminar el registro actual?`,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Sí, eliminar',
  cancelButtonText: 'No, cancelar'
}).then(result=> {
  if (result.isConfirmed) {
   
    fetch('/allClear')
    .then(res => res.json())
    .then(respuesta => {
      if (respuesta.status == true) {
        Swal.fire(respuesta.message)
        .then(() => {
          location.reload();
        });
      }else if(respuesta.status== null){
      	Swal.fire(respuesta.message);
      }else{
      	Swal.fire(respuesta.message);
      }
    })
  } else {
    // Código para cancelar la eliminación
    Swal.fire('Cancelado', `proceso cancelado , registro conservado`, 'info');
  }
});

});