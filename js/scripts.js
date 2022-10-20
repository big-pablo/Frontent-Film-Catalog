$(document).ready(function (){
    LoadFilms();
    CheckforAuth();
});

function LoadFilms(){
    fetch("https://react-midterm.kreosoft.space/api/movies/1")
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        $("#films-container").empty();
        let template = $('#film-card');
        for (let film of json.movies)
        {
            let block = template.clone();
            block.attr("filmid", film.id);
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
                block.find("#film-rating").text(block.find("#film-rating").text() + avgRating);
            }
            block.removeClass("d-none");
            $("#films-container").append(block);
        }
    });
}

function CheckforAuth(){
    fetch("https://react-midterm.kreosoft.space/api/account/profile", {headers: new Headers({
            "Authorization" : "Bearer " + localStorage.getItem("token")
        })
    })
    .then((response) => {
        if (response.ok){
            let navbarLeft = $("#navbar-left");
            let navbarRight = $("#navbar-right");
            let template = $("#auth-user-navbar-template");
            let leftBlockOne = template.clone();
            leftBlockOne.find(".nav-link").text("Избранное");
            leftBlockOne.find(".nav-link").addClass("text-muted");
            leftBlockOne.removeClass("d-none");
            navbarLeft.append(leftBlockOne);
            let leftBlockTwo = template.clone();
            leftBlockTwo.find(".nav-link").text("Мой профиль");
            leftBlockTwo.find(".nav-link").addClass("text-muted");
            leftBlockTwo.removeClass("d-none");
            navbarLeft.append(leftBlockTwo);
            navbarRight.empty();
            let rightBlockOne = template.clone();
            rightBlockOne.find(".nav-link").attr("id", 'add-nickname');
            rightBlockOne.removeClass("d-none");
            navbarRight.append(rightBlockOne);
            let rightBlockTwo = template.clone();
            rightBlockTwo.find(".nav-link").text("Выйти");
            rightBlockTwo.removeClass("d-none");
            navbarRight.append(rightBlockTwo);
            return response.json();
        }
    })
    .then((json) =>{
        console.log(json);
        $("#add-nickname").text("Авторизован как - " + json.nickName);
    })
}