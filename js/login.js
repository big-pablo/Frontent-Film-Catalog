function Login()
{
    let user = {
        username: $("#inputLogin").val(),
        password: $("#inputPassword").val()
    }
    for (title in user)
    {
        if (user[title] == "")
        {
            $("#CommonAlert").text("Все поля обязательны к заполнению");
            $("#CommonAlert").removeClass("d-none");
            return;
        }
    }
    fetch("https://react-midterm.kreosoft.space/api/account/login", {method: 'POST', 
    body:JSON.stringify(user),
    headers: new Headers({"Content-Type": "application/json"})
    })
    .then(async (response) => {
        if (response.ok)
        {
            let json = await response.json();
            localStorage.setItem('token',json.token);
            localStorage.setItem('id', json.id);
            window.location.href = '/index.html';
        }
        else
        {
            $("#CommonAlert").text("Ошибка аутентификации");
            $("#CommonAlert").removeClass("d-none");
        }
    })
}

function GoToRegistration()
{
    window.location.href = "/html/registration.html";
}