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
        console.log(json);
        for (let film in json.movies)
        {
            let block = $("#film-card").clone();
            block.attr('id', json.movies[film]);
            block.find("#film-header").text(film.name);
            block.find("#film-image").attr("src", film.poster);
            block.find("#film-year").text(film.year);
            let countryAndGenreBlock = block.find("#film-country-n-genre");
            countryAndGenreBlock.text(`${film.country} ●`);
            for (let genre of film.genres)
            {
                if (genre == film.genres[film.genres.length-1])
                {
                    countryAndGenreBlock.text(countryAndGenreBlock.text() + " " + genre.name);
                }
                else
                {
                    countryAndGenreBlock.text(countryAndGenreBlock.text() + " " + genre.name + ",");
                }
            }
            let totalPoints = 0;
            for (let review of film.reviews)
            {
                totalPoints += review.rating;
            }
            let avgRating = totalPoints/film.reviews.length;
            if (isNaN(avgRating))
            {
                block.find("#film-rating").text("Отзывов пока нет");
            }
            else
            {
                block.find("#film-rating").text(block.find("#film-rating").text() + avgRating.toFixed(1));
            }
            block.removeClass("d-none");
            $("#films-container").append(block);
        }
    })
}