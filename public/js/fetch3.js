const formLogin = document.getElementById('form-login');

formLogin.addEventListener('submit',e=>{
	e.preventDefault();

	const usuario = document.getElementById('usuario').value;
	const password = document.getElementById('password').value;

	fetch('/login',{
		method:'POST',
		headers:{
			"Content-Type":"application/json"
		},
		body:JSON.stringify({usuario,password})
	})
	.then(res=>res.json())
	.then(res=>{
		if(res.status){
			Swal.fire(res.message).then(()=>window.location.href='/dashboard')
		}else if(res.status==null){
             Swal.fire(res.message);
		}else{
			Swal.fire(res.message);
		}
	})
});