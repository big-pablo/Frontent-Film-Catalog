$(document).ready(function (){
    LoadFilms(localStorage.getItem('currentPage'));
    CreatePagination(localStorage.getItem("totalPages"), localStorage.getItem('currentPage'));
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
                block.find("#film-rating").text(block.find("#film-rating").text() + avgRating.toFixed(1));
            }
            block.removeClass("d-none");
            $("#films-container").append(block);
        }
        localStorage.setItem("currentPage", json.pageInfo.currentPage);
        localStorage.setItem("totalPages", json.pageInfo.pageCount)
    });
}

function CreatePagination(pagesAmount, currentPage)
{
    let template = $(".page-number-template");
    for (let i = 1; i <= pagesAmount; i++)
    {
        let block = template.clone();
        block.find(".page-link").text(i);
        block.removeClass('d-none');
        block.attr('page', i);
        if (i == currentPage)
        {
            block.addClass('active');
        }
        block.insertBefore($(".pagination #next-sign"));
    }
    PageChangeEvent();

}

function PageChangeEvent()
{
    $(".page-number-template").click(function() {
        $(".page-number-template").removeClass('active');
        $(this).addClass('active');
        LoadFilms($(this).text());
    })
    $("#next-sign").click(function(){
        let currentPage = $(`[page=${localStorage.getItem('currentPage')}]`).attr("page");
        let nextPage = Number(currentPage)+1;
        if (nextPage <= localStorage.getItem('totalPages'))
        {
            $(`[page=${localStorage.getItem('currentPage')}]`).removeClass("active");
            $(`[page=${nextPage}]`).addClass("active");
            LoadFilms(nextPage);
        }
    })
    $("#previous-sign").click(function(){
        let currentPage = $(`[page=${localStorage.getItem('currentPage')}]`).attr("page");
        let previousPage = Number(currentPage)-1;
        if (previousPage > 0)
        {
            $(`[page=${localStorage.getItem('currentPage')}]`).removeClass("active");
            $(`[page=${previousPage}]`).addClass("active");
            LoadFilms(previousPage);
        }
    })
}