$(document).ready(function() {
    // catch click on search button
    $('#search-btn').click(function() {
        mainSearch();
    });

    // catch Enter key in search button
    $('#searchbar').keypress(function(event) {
        if(event.which == 13) {
            mainSearch();
        }
    });

    // organize and print data from api
    function compileResults(object, string) {
        // add query on top of the page
        queryString(string);
        // get html from card template
        var template_card_html = $('#card-template').html();
        // ready the function
        var template_card_function = Handlebars.compile(template_card_html);

        for(var i = 0; i < object.length; i++) {
            // select a movie
            var movie_result = object[i];
            // get info from api
            var title = movie_result.title;
            var og_title = movie_result.original_title;
            var og_language = movie_result.original_language;
            var vote = movie_result.vote_average;
            // organize info in an object
            var context = {
                'title' : title,
                'og_title' : og_title,
                'og_language' : og_language,
                'vote' : vote
            };
            // set the object inside the template
            var template_final = template_card_function(context);
            // append selected movie's info to movie card wrapper
            $(template_final).appendTo('.movie-cards');
            // add movie language flag to card
            addFlag(context);
            // add movie rating to card
            addVote(context);
            // empty searchbar
            $('#searchbar').val('');
        }
    }
    
    // add query on top of the page
    function queryString(string) {
        var search = {
            'query' : string
        }
        // get html from card template
        var template_search_html = $('#search-template').html();
        // ready the function
        var template_search_function = Handlebars.compile(template_search_html);
        // set the object inside the template
        var template_search_final = template_search_function(search);
        // append selected movie's info to movie wrapper
        $(template_search_final).appendTo('.movie-search');
    }

    // add language flag to card
    function addFlag(object) {
        // get html from language template
        var template_flag_html = $('#language-template').html();
        // ready the function
        var template_flag_function = Handlebars.compile(template_flag_html);
        // if the movie's language is de, en, es, fr, or it
        if(object.og_language == 'de' || object.og_language == 'en' || object.og_language == 'es' || object.og_language == 'fr' || object.og_language == 'it') {
            // set the object inside the template
            var template_flag_final = template_flag_function(object);
            // append selected movie's info to language
            $('.language').last().append(template_flag_final);
        } else {
            // capitalize language string
            var languageCapitalized = object.og_language.substr(0,1).toUpperCase() + object.og_language.substr(1);
            // append string to language
            $('.language').last().append('Original Language: ' + languageCapitalized);
        }
    }

    // add movie rating to card
    function addVote(object) {
        // get html from star template
        var template_star_html = $('#star-template').html();
        // ready the function
        var template_star_function = Handlebars.compile(template_star_html);
        // change rating from 1to10 to 1to5
        var toFive = object.vote / 2;
        // Round a number upward to its nearest integer
        var stars = Math.ceil(toFive);
        // number of empty stars
        var starsRemainder = 5 - stars;
        // if the rating is 5/5
        if(starsRemainder == 0) {
            //print 5 whole stars
            for (var i = 0; i < stars; i++) {
                var template_star_final = template_star_function();
                // append selected movie's info to movie wrapper
                $('.vote').last().append(template_star_final);
                // FA class for whole stars
                $('.fa-star').last().addClass('fas');
            }
        } else {
            //print whole stars
            for (var i = 0; i < stars; i++) {
                var template_star_final = template_star_function();
                // append selected movie's info to movie wrapper
                $('.vote').last().append(template_star_final);
                // FA class for whole stars
                $('.fa-star').last().addClass('fas');
            }
            //print empty stars
            for (var i = 0; i < starsRemainder; i++) {
                var template_star_final = template_star_function();
                // append selected movie's info to movie wrapper
                $('.vote').last().append(template_star_final);
                // FA class for empty stars
                $('.fa-star').last().addClass('far');
            }
        }
    }

    function mainSearch() {
        // get text in searchbar
        var search_text = $('#searchbar').val();
        // ajax call to get list of movies
        $.ajax ({
            'url' : 'https://api.themoviedb.org/3/search/movie',
            'method' : 'GET',
            'data' : {
                'api_key' : 'd4767df425ce462ce9f76db8238d5e56',
                'query' : search_text
            },
            'success' : function(data) {
                // get results from api
                var movie_results = data.results;
                // if previous search results are displayed
                if($('.movie-cards').children().length > 0) {
                    // erase search history
                    $('.movie-search').empty();
                    $('.movie-cards').empty();
                    // compile new search
                    compileResults(movie_results, search_text);
                // no previous history displayed
                } else {
                    // compile new search
                    compileResults(movie_results, search_text);
                }
            },
            'error' : function() {
                console.log('Si è verificato un errore');
            }
        });
    }
});