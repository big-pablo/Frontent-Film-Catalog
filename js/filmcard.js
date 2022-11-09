$(document).ready(function() {
    console.log('work');    
    LoadFilmDetails();
    CheckforAuth();
})


function LoadFilmDetails()
{
    fetch(`https://react-midterm.kreosoft.space/api/movies/details/${localStorage.getItem("currentFilm")}`)
    .then(async (response) =>{
        let json = await response.json();
        $("#film-image").attr('src', json.poster);
        $("#name").text(`${json.name} (${json.year})`);
        $("#description").text(json.description);
        $("#year").text(json.year);
        $("#country").text(json.country);
        let genres = "";
        for (i in json.genres)
        {
            genres += json.genres[i].name;
            if (i != json.genres.length-1)
            {
                genres += ", ";
            }
        }
        $("#genres").text(genres);
        $("#time").text(`${json.time} мин.`);
        $("#motto").text(json.tagline);
        $("#producer").text(json.director);
        $("#budget").text(`$${json.budget}`);
        $("#fees").text(`$${json.fees}`);
        $("#age").text(`${json.ageLimit}+`);
        LoadReviews(json);
    })
}

function LoadReviews(json)
{
    console.log(json);
    for (let review in json.reviews)
    {
        let currReview = json.reviews[review];
        let block = $(".review-template").clone();
        if (!currReview.isAnonymous)
        {
            if (currReview.author.avatar != null)
            {
                block.find(".user-avatar").attr('src', currReview.author.avatar);
            }
            block.find(".user-nickname").text(currReview.author.nickName);
        }
        else
        {
            block.find(".user-nickname").text("Анонимный пользователь");
        }
        block.find(".rating").text(currReview.rating);
        console.log(Number(currReview.rating))
        if (Number(currReview.rating) > 5)
        {
            block.addClass("good-review")
        }
        else
        {
            block.addClass('bad-review');
        }
        let dateTime = currReview.createDateTime.split("T");
        block.find(".review-date").text(ParseDate(dateTime[0]));
        block.find(".review-text").text(currReview.reviewText);
        block.removeClass('d-none');
        block.removeClass("review-template");
        $(".review-container").append(block);
    }
}


function CheckforAuth()
{
    fetch("https://react-midterm.kreosoft.space/api/account/profile", {headers: new Headers({
    "Authorization" : "Bearer " + localStorage.getItem("token")
})
})
.then(async (response) => {
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
    rightBlockTwo.attr('onclick', 'Logout()');
    navbarRight.append(rightBlockTwo);
    let json = await response.json();
$("#add-nickname").text("Авторизован как - " + json.nickName);
}
})
}   


function ParseDate(date)
{
    let YYYYMMDD = date.split("-");
    let result = YYYYMMDD[2] + ".";
    result += YYYYMMDD[1] + ".";
    result += YYYYMMDD[0];
    return result
}