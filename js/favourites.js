$(document).ready(function(){
    CheckforAuth();
    LoadFavourites();
});

function CheckforAuth(){
    fetch("https://react-midterm.kreosoft.space/api/account/profile", {headers: new Headers({
            "Authorization" : "Bearer " + localStorage.getItem("token")
        })
    })
    .then(async (response) => {
        if (response.ok){
            let json = await response.json();
            $("#add-nickname").text("Авторизован как - " + json.nickName);
            localStorage.setItem('id', json.id);
        }
        else
        {
            window.location.href = "/html/login.html";
        }
    })
}

function Logout()
{
    localStorage.removeItem("token");
    window.location.href = "/index.html";
}


function LoadFavourites()
{
    fetch("https://react-midterm.kreosoft.space/api/favorites", {headers: new Headers({
        "Authorization" : "Bearer " + localStorage.getItem("token")
    })
})
    .then(async (response)=>{
        let json = await response.json();
        for (let film in json.movies)
        {
            let block = $("#film-card").clone();
            block.attr('id', json.movies[film].id);
            block.find("#film-header").text(json.movies[film].name);
            block.find("#film-image").attr("src", json.movies[film].poster);
            block.find("#film-image").attr('id', json.movies[film].id);
            block.find("#film-year").text(json.movies[film].year);
            let countryAndGenreBlock = block.find("#film-country-n-genre");
            countryAndGenreBlock.text(`${json.movies[film].country} ●`);
            for (let genre in json.movies[film].genres)
            {
                if (genre == json.movies[film].genres.length-1)
                {
                    countryAndGenreBlock.text(countryAndGenreBlock.text() + " " + json.movies[film].genres[genre].name);
                }
                else
                {
                    countryAndGenreBlock.text(countryAndGenreBlock.text() + " " + json.movies[film].genres[genre].name + ",");
                }
            }
            let totalPoints = 0;
            for (let review of json.movies[film].reviews)
            {
                totalPoints += review.rating;
            }
            let avgRating = totalPoints/json.movies[film].reviews.length;
            if (isNaN(avgRating))
            {
                block.find("#film-rating").text("Отзывов пока нет");
            }
            else
            {
                block.find("#film-rating").text(block.find("#film-rating").text() + avgRating.toFixed(1));
            }
            block.find(".btn-danger").attr('id', json.movies[film].id);
            block.find(".btn-danger").click(function(){ //Вешаю функцию удаления
                let id = $(this).attr('id');
                fetch(`https://react-midterm.kreosoft.space/api/favorites/${id}/delete`, {headers: new Headers({
                "Authorization" : "Bearer " + localStorage.getItem("token")
                }), method:"DELETE"
                })
                .then((response) => {
                    if (response.ok)
                    {
                        window.location.href = "/html/favourites.html";
                    }
                })
            }); //Функция удаления кончилась
            block.removeClass("d-none");
            $("#films-container").append(block);
        }
    })
}
