var form = document.getElementById('form-login');
form.onsubmit = function(e){
    e.preventDefault();
    var auth = {
        username: e.target[0].value,
        password: e.target[1].value
    }
    sendAjax("POST", "/login", false, [['accept', 'json']], JSON.stringify(auth), function(data){
        console.log(data);
        if(data == "admin"){
            window.location = "/admin";
        }else if(data == "user"){
            window.location = "/siswa";
        }else{
            alert('Username atau Password salah');
            window.location = "/login";
        }
    });
}
