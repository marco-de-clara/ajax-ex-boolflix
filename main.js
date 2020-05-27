$(document).ready(function() {
    // catch click on search button
    $('#search-btn').click(function() {
        mainSearch();
    });

    // catch Enter key in search button
    $('#searchbar').keypress(function(event) {
        if(event.which == 13) {
            mainSearch();
        };
    });

    // mouse over
    $('main').on('mouseenter', '.poster', function(event) {
        $(event.target).delay(500).queue(function(next) {
            $(event.target).addClass('hide');
            next();
        });
    });

    //mouse leave
    $('main').on('mouseleave', '.card', function(event) {
        $(event.target).siblings().removeClass('hide');
    });

    // organize and print data from api
    function compileResults(object) {
        // get html from card template
        var template_card_html = $('#card-template').html();
        // ready the function
        var template_card_function = Handlebars.compile(template_card_html);

        for(var i = 0; i < object.length; i++) {
            // select a media
            var media_result = object[i];
            // get info from api
            var title = media_result.title;
            var og_title = media_result.original_title;
            var og_language = media_result.original_language;
            var vote = media_result.vote_average;
            var poster = media_result.poster_path;
            var overview = media_result.overview;
            // organize info in an object
            var context = {
                'title' : title,
                'og_title' : og_title,
                'og_language' : og_language,
                'vote' : vote,
                'poster' : poster,
                'overview' : overview
            };

            // set the object inside the template
            var template_final = template_card_function(context);
            // append selected media's info to media card wrapper
            $(template_final).appendTo('.media-cards');
            // add media language flag to card
            addFlag(context);
            // add media rating to card
            addVote(context);
            // empty searchbar
            $('#searchbar').val('');
        }
    };
    
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
        // append selected media's info to media wrapper
        $(template_search_final).appendTo('.media-search');
    };

    // add language flag to card
    function addFlag(object) {
        // get html from language template
        var template_flag_html = $('#language-template').html();
        // ready the function
        var template_flag_function = Handlebars.compile(template_flag_html);
        var flags = ['de', 'en', 'es', 'fr', 'it'];
        // if the media's language is de, en, es, fr, or it
        if(flags.includes(object.og_language)) {
            // set the object inside the template
            var template_flag_final = template_flag_function(object);
            // append selected media's info to language
            $('.language').last().append(template_flag_final);
        } else {
            // capitalize language string
            var languageCapitalized = object.og_language.substr(0,1).toUpperCase() + object.og_language.substr(1);
            // append string to language
            $('.language').last().append('Original Language: ' + languageCapitalized);
        }
    };

    // add media rating to card
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
                // append selected media's info to media wrapper
                $('.vote').last().append(template_star_final);
                // FA class for whole stars
                $('.fa-star').last().addClass('fas');
            }
        } else {
            //print whole stars
            for (var i = 0; i < stars; i++) {
                var template_star_final = template_star_function();
                // append selected media's info to media wrapper
                $('.vote').last().append(template_star_final);
                // FA class for whole stars
                $('.fa-star').last().addClass('fas');
            }
            //print empty stars
            for (var i = 0; i < starsRemainder; i++) {
                var template_star_final = template_star_function();
                // append selected media's info to media wrapper
                $('.vote').last().append(template_star_final);
                // FA class for empty stars
                $('.fa-star').last().addClass('far');
            }
        }
    };

    // main movie search
    function movieSearch(string) {
        // ajax call to get list of medias
        $.ajax ({
            'url' : 'https://api.themoviedb.org/3/search/movie',
            'method' : 'GET',
            'data' : {
                'api_key' : 'd4767df425ce462ce9f76db8238d5e56',
                'query' : string
            },
            'success' : function(data) {
                // get results from api
                var media_results = data.results;
                // compile new search
                compileResults(media_results);
            },
            'error' : function() {
                console.log('Si è verificato un errore');
            }
        });
    };

    // main tv shows search
    function tvSearch(string) {
        // ajax call to get list of medias
        $.ajax ({
            'url' : 'https://api.themoviedb.org/3/search/tv',
            'method' : 'GET',
            'data' : {
                'api_key' : 'd4767df425ce462ce9f76db8238d5e56',
                'query' : string
            },
            'success' : function(data) {
                // get results from api
                var media_results = data.results;
                // normalize object
                for(var i = 0; i < media_results.length; i++) {
                    // select a media
                    var media_result = media_results[i];
                    // get info from api
                    var title = media_result.name;
                    var original_title = media_result.original_name;
                    var original_language = media_result.original_language;
                    var vote_average = media_result.vote_average;
                    var poster_path = media_result.poster_path;
                    var overview = media_result.overview;

                    // organize info in an object
                    var context = {
                        'title' : title,
                        'original_title' : original_title,
                        'original_language' : original_language,
                        'vote_average' : vote_average,
                        'poster_path' : poster_path,
                        'overview' : overview
                    };
                }
                // compile new search
                compileResults(context);
            },
            'error' : function() {
                console.log('Si è verificato un errore');
            }
        });
    };

    function mainSearch() {
        // get text in searchbar
        var search_text = $('#searchbar').val();
        // if previous search results are displayed
        if($('.media-cards').children().length > 0) {
            // erase search history
            $('.media-search').empty();
            $('.media-cards').empty();
            
            // add query on top of the page
            queryString(search_text);
            // search
            movieSearch(search_text);
            tvSearch(search_text);
        } else {
            // add query on top of the page
            queryString(search_text);
            // search
            movieSearch(search_text);
            tvSearch(search_text);
        }
    }
});