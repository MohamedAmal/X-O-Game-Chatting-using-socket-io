var email = document.getElementById('email')
var password = document.getElementById('password')



function signUp() {
    var data = {
        email: email.value,
        password: password.value
    }
    $.ajax({
        url: "http://localhost:5000/signup",
        type: "POST",
        data: data,
        dataType: "json"
    }).done(function (data) {
        alert('DONE')
    });
}