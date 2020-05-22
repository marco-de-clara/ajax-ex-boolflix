$(document).ready(function() {
    // catch click on search button
    $('#search-btn').click(function() {
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
                if($('.movie-wrapper').children().length > 0) {
                    // erase search history
                    $('.movie-wrapper').empty();
                    // compile new search
                    compileMovieResults(movie_results);
                // no previous history displayed
                } else {
                    // compile new search
                    compileMovieResults(movie_results);
                }
            },
            'error' : function() {
                console.log('Si è verificato un errore');
            }
        });
    });
    // organize and print data from api
    function compileMovieResults(object) {
        for(var i = 0; i < object.length; i++) {
            // select a movie
            var movie_result = object[i];
            // get info from api
            var title = movie_result.title;
            var og_title = movie_result.original_title;
            var og_language = movie_result.original_language;
            var vote = movie_result.vote_average;
            // organize info in an object
            var movie_context = {
                'title' : title,
                'og_title' : og_title,
                'og_language' : og_language,
                'vote' : vote
            };
            // print selected movie's info
            printMovieResult(movie_context);
            
        }
    }

    // print selected movie's info
    function printMovieResult(object) {
        $('<ul></ul>').appendTo('.movie-wrapper');
        $('<li>Title: '+ object.title +'</li>').appendTo('ul:last-child');
        $('<li>Original Title: '+ object.og_title +'</li>').appendTo('ul:last-child');
        $('<li>Original Language: '+ object.og_language +'</li>').appendTo('ul:last-child');
        $('<li>Vote Average: '+ object.vote +'</li>').appendTo('ul:last-child');
        $('<br>').appendTo('.movie-wrapper');
    };

});