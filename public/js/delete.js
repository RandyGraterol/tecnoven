const deleteUser = document.querySelectorAll('.deleteUser');
let idUser,endPoinst,tabla;

for(let p = 0 ; p < deleteUser.length; p++){

deleteUser[p].addEventListener('click',()=>{
   
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
   
    endPoinst = deleteUser[p].dataset.ruta;
    idUser = deleteUser[p].dataset.id;
    tabla = deleteUser[p].dataset.tabla;
     
    fetch(`${endPoinst}${idUser}/${tabla}`,{
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(respuesta => {
      if (respuesta.status == true) {
        Swal.fire('¡Registro Eliminado')
        .then(() => {
          location.reload();
        });
      }
    })
    .catch(error => {
      console.error('Error al eliminar registro', error);
      Swal.fire('Error al eliminar registro', error.message, 'error');
    });
  } else {
    // Código para cancelar la eliminación
    Swal.fire('Cancelado', `proceso cancelado , registro conservado`, 'info');
  }
});


});
}