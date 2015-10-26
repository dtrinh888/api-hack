$(function(){
	//search function using auto-complete method
	$('#movie-search').autocomplete({
		//request the api info, response to display auto-complete titles
		source: function(request, response){
			//object will be context of all AJAX-related callbacks
			$.ajax({
				//grabbed url from http://docs.themoviedb.apiary.io/#reference/search/searchmovie/get at /search/movie reference
				url: 'http://api.themoviedb.org/3/search/movie',
				data: {
					api_key: '990ba45b90f56c57b4e00a54fc773d8c',
					//required CGI escaped string parameter 

					//-----where did term come from???
					query: request.term,
					//By default, the search type is 'phrase'. This is almost guaranteed the option you will want. 
					//It's a great all purpose search type and by far the most tuned for every day querying. 
					//For those wanting more of an "autocomplete" type search, set this option to 'ngram'.
					search_type: 'ngram'
				},
				//function to grab data from /search/movies's api
				success: function(data){
					//movies array to store all search terms
					var movies= [];
					//.each to loop through array of search results
					//data.results grabs the data from the results object of /search/movie's api
					//index grabs element from array 
					//value is the object's value
					$.each(data.results, function(index, value){
						//object for what info we need
						var movieObject = {
							//need to grab genre's id
							id: value.id,
							//grab the movies's title
							label: value.title
						};
						//push movieObject values into movies array
						movies.push(movieObject);
					});
					//call back function that triggers the drop down list of search terms
					response(movies);
				}
			});
		},
		//must type in at least 3 characters for drop down list to show
		minLength: 3,
		//function to grab the movie to show on page
		//e grabs info of the /movie/{id}'s api
		//ui for user to select movie
		select: function(e, ui) {
			//variable to grab the movie's id


			//-------where did item come from???
			var id = ui.item.id;


			//-------when do we use .ajax and when to use .get??
			$.ajax({
				//grabs user movie by concatenating 
				url: 'https://api.themoviedb.org/3/movie/' + id,
				data: {
					api_key: '990ba45b90f56c57b4e00a54fc773d8c'
				},
				success: function(movie) {
					displayMovie(movie);
				}
			});
		}
	});

	var displayMovie = function(movie) {
		$('#search-results').html(
			'<span id="movie-container">' +
				'<div id="movie-poster">' +
					'<img src="http://image.tmdb.org/t/p/w300' + movie.poster_path + '">' +
				'</div>' +
				'<div id="movie-content">' +
					'<div id="movie-title">' +
						movie.original_title +
					'</div>' +
				'</div>' +	
				'<div class="clear"></div>' +
			'</span>'
		);
	};

	var topMovies = function(genre, movie){
		var id = movie.results.id;
		$.ajax({
			url: 'http://api.themoviedb.org/3/discover/movie',
			data: {
				api_key: '990ba45b90f56c57b4e00a54fc773d8c',
				sort_by: popularity.desc,
				genres: {
					id: 18,
					name: "Drama"
				}
			},
			success: function(movies) {
				displayTopMovie(movies);
			}
		});
	};
	var displayTopMovie = function(movie){
		$('#top-movies').html(
			'<span id="topMovies-container">' +
				'<div id="topMovies-poster">' +
					'<img src="http://image.tmdb.org/t/p/w300' + movie.poster_path + '">' +
				'</div>' +	
			'</span>'
		);
	};
});