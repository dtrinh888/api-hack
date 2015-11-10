$(function(){
	
	var clearResults = $('.search-results, .top-results, .top-container');

	var getHomePage = function(){
		$.ajax({
			url: 'http://api.themoviedb.org/3/movie/top_rated',
			data: {
				api_key: '990ba45b90f56c57b4e00a54fc773d8c'
			},
			success: function(topRatedMovies) {
				console.log('top',topRatedMovies);
				displayMoviesInline(topRatedMovies.results);
			} 
		});
	};	

	getHomePage();

	$('.nav-container h1').on('click', getHomePage);

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

			$('.top-results').empty();

			$.ajax({
				//grabs user movie by concatenating 
				url: 'https://api.themoviedb.org/3/movie/' + id,
				data: {
					api_key: '990ba45b90f56c57b4e00a54fc773d8c',
					append_to_response: 'reviews,similar,rating,videos'
				},
				success: function(movie) {
					console.log('movie', movie);
					displayMovie(movie);
				}
			});
		}
	});
	
	$('#search-container').submit(function(){
		clearResults.empty();
		event.preventDefault();
		var movieSearch = $('#movie-search').val();
		
		if(movieSearch === ''){
			console.log('Must enter a value');
			return;
		} else {
			$.ajax({
				url: 'http://api.themoviedb.org/3/search/movie',
				data: {
					api_key: '990ba45b90f56c57b4e00a54fc773d8c',
					query: movieSearch
				},
				success: function(movies) {
					clearResults.empty();
					console.log(movies);
					displayMovies(movies.results);
				}	
			});
		}	
	});

	var displayMovie = function(movie) {
		clearResults.empty();
		console.log('mov', movie);
		var similarMovies = '';
		movie.similar.results = movie.similar.results.slice(0, 10);
		$.each(movie.similar.results, function(index, similarMovie){
			similarMovies += 
						'<span class="similar-movies">' + 
							'<img src="http://image.tmdb.org/t/p/w300' + similarMovie.poster_path + '" data-id="' + similarMovie.id + '">' + 
						'</span>';
						});
		var topMovies = 
		$('.top-results').html(
			'<span class="movie-container">' +
				'<h1>Movie Search</h1>' +
				'<div class="movie-poster">' +
					'<a href="' + movie.homepage +'">' + '<img src="http://image.tmdb.org/t/p/w300' + movie.poster_path + '">' + '</a>' +
				'</div>' +
				'<div class="movie-content">' +
					'<div class="movie-tagline">' + 
						'<em>' + '"' + movie.tagline + '"' + '</em>' +
					'</div>' +
					'<div class="movie-title">' +
						'<strong>' + 'Title: ' + '</strong>' + movie.original_title + '<br>' + 
						'<strong>' + 'Release Date: ' + '</strong>' + movie.release_date +
					'</div>' +
					'<div class="movie-overview">' + 
						'<strong>' + 'Overview: ' + '</strong>' + movie.overview +
					'</div>' +
				'</div>' +	
				'<div class="clear"></div>' + 
				'<h2>Similar Movies to ' + movie.original_title + '</h2>' +
				similarMovies +
			'</span>'
		);
	};

	//---Creating drop down list to show top movies in each genre

	//array to store all of genre's names
	var genreList = [];
	//variable to call class movie-genre 
	var list = $('.movie-genre');
	
	//retrieve genre names from API 
	$.ajax({
	  //API url where all the genre names are stored
	  url: 'http://api.themoviedb.org/3/genre/movie/list',
	  data: {
	    api_key: '990ba45b90f56c57b4e00a54fc773d8c'
	  },
	  //genre parameter is where genre's objects name value is stored
	  success: function(genre){
	    console.log('genre', genre);
	    //store genre names to genreList array
     	genreList = genre.genres;
      //.each is to loop through genreList to append all names into drop down box
      //index parameter to grab each element of genreList array
      //genre is where values are stored, in this instance id, name are the values 
	    $.each(genreList, function(index, genre){

	      //function to append all values to $('.movie-genre') aka list
	      list.append(
	          //<option>'s value needs to be set to genre.id to grab id number when user selects genre from drop down box
	          //genre.name to display genre name inside the drop down box
	          '<option value=" '+ genre.id +'">' + genre.name + '</option>'
	        );
	    });
	  }
	});
	
	//function to display top movies for each genre
	//.on() method when user selects genre
	//---- why change?
	list.on('change', function(){
	  clearResults.empty();
	  //variable to store the value the user selects
	  var id = $(this).val();
	  console.log(id);
	  //set first option value to 0 in HTML so that it defaults to 'Select Genre for Top Movies' 
	  //...so that nothing is displayed until user selects a specific genre
	  //if statement that when id is not equal to 0 display genre id that user selects
	  //did not use !== because option value of 0 is string in html if using !==
	  //...the statement would only be true if 0 is not an integer and string
	  if (id != 0){
	    //
	    $.ajax({
      		url: 'http://api.themoviedb.org/3/discover/movie',
      		data: {
      			api_key: '990ba45b90f56c57b4e00a54fc773d8c',
      			sort_by: 'popularity.desc',
      			with_genres: id
      		},
      		success: function(popMovies){
      			displayMovies(popMovies.results);				
	      	}
    	});
	  }
	});

	$('.top-results').on('click', '.topMovies-poster img, .similar-movies img', function(){
		console.log($(this).data('id'));
		var movieID = $(this).data('id');	
		clearResults.empty();
		$.ajax({
			//grabs user movie by concatenating 
			url: 'https://api.themoviedb.org/3/movie/' + movieID,
			data: {
				api_key: '990ba45b90f56c57b4e00a54fc773d8c',
				append_to_response: 'reviews,similar,rating,videos'
			},
			success: function(movie) {
				console.log('movie', movie);
				displayMovie(movie);
			}
		});
	});

	var displayMovies = function(movies) {
	  console.log('movies', movies);
	    clearResults.empty();
		  $.each(movies, function(index, value){
		  	
	  		$('.top-results').append(
	  			'<div class="popMovies-container">' +
	  				'<div class="movie-poster">' + 
	  					'<img src="http://image.tmdb.org/t/p/w300' + value.poster_path + '">' +
	  				'</div>' + 
	  				'<div class="movie-content">' + 
	  					value.original_title +
	  				'</div>' +
	  				'<div class="clear"></div>' +
	  			'</div>'	 		
	  		);
	    });
	};

	var displayMoviesInline = function(movies){
		clearResults.empty();
		$.each(movies, function(index, topMovies){
			$('.top-container').html(
				'<h1>Popular Movies</h1>'
			);
			$('.top-results').append(
				'<span class="topMovies-poster">' +
					'<img src="http://image.tmdb.org/t/p/w300' + topMovies.poster_path + '" data-id="'+ topMovies.id + '">' +
				'</span>'
			);
			console.log(topMovies.poster_path);
		});
	};
	var genreTitle = function(genre){
		clearResults.empty();
		$.each(genre, function(i, genreName){
			$('.top-container').html(
		  		'<h1>Top ' + genreName.name + ' Movies'
		  	);
		console.log('a', genreName.name);
		});
	};
});