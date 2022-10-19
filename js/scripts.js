$(document).ready(function (){
    LoadFilms();
});

function LoadFilms(){
    fetch("https://react-midterm.kreosoft.space/api/movies/1")
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        console.log(json)
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
            console.log(typeof(avgRating));
            console.log(avgRating);
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