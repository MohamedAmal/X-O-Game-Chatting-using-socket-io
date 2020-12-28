var email = document.getElementById('email')
var password = document.getElementById('password')

$("#sign-in-button").click(function (e) {
    var data = {
        email: email.value,
        password: password.value
    }
    $.ajax({
        url: "http://localhost:5000/signin",
        type: "POST",
        data: data,
        dataType: "json"
    }).done(function (data) {
        if(data == true ){
            console.log('this is data '+data)
            window.location = 'Home.html'
        }
        console.log('doneee')
    });
    e.preventDefault();
});