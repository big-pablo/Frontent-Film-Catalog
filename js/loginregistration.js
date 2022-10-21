function Login()
{
    let user = {
        username: $("#inputLogin").val(),
        password: $("#inputPassword").val()
    }
    fetch("https://react-midterm.kreosoft.space/api/account/login", {method: 'POST', body:JSON.stringify(user),
    headers: new Headers({"Content-Type": "application/json"})
    })
    .then((response) => {
        if (response.ok)
        {
            return response.json();
        }
    })
    .then((json) =>
    {
        console.log(json);
        localStorage.setItem('token',json.token);
        window.location.href = '/index.html';
    })
}
