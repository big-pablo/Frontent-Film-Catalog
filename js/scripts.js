$(document).ready(function (){
    let pages = LoadFilms();
    console.log(typeof(pages));
    CreatePagination(pages[0], pages[1]);
});
function LoadFilms(page=1){
    fetch(`https://react-midterm.kreosoft.space/api/movies/${page}`)
    .then((response) => {
        return response.json();
    })
    .then((json) => {
        $("#films-container").empty();
        let template = $('.film-card');
        for (let film of json.movies)
        {
            let block = template.clone();
            block.attr("id", film.id);
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
        console.log([json.pageInfo.currentPage,json.pageInfo.pageCount]);
        return [json.pageInfo.currentPage,json.pageInfo.pageCount];
    });
}

function CreatePagination(currentPage, pagesAmount)
{
    let template = $(".page-number-template");
    for (let i = 1; i <= pagesAmount; i++)
    {
        let block = template.clone();
        block.find(".page-link").text(i);
        block.removeClass('d-none');
        block.insertBefore($(".pagination #next-sign"));
    }
    PageChangeEvent();
}

function PageChangeEvent()
{
    $(".page-number-template").click(function() {
        console.log('Зашли');
        $(".page-number-template").removeClass('active');
        $(this).addClass('active');
        console.log($(this).text());
        LoadFilms($(this).text());
    })
}