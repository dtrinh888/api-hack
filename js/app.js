$(function(){
	//search function using auto-complete method
	$('#movie-search').auto-complete({
		//request the api info, response to display auto-complete titles
		source: function(request, response){
			//object will be context of all AJAX-related callbacks
			$.ajax({
				//grabbed url from http://docs.themoviedb.apiary.io/#reference/search/searchmovie/get at /search/movie reference
				url: 'http://api.themoviedb.org/3/search/movie',
				data: {
					api_key: '990ba45b90f56c57b4e00a54fc773d8c',
					//required CGI escaped string parameter 
					query: request.term,
					//By default, the search type is 'phrase'. This is almost guaranteed the option you will want. 
					//It's a great all purpose search type and by far the most tuned for every day querying. 
					//For those wanting more of an "autocomplete" type search, set this option to 'ngram'.
					search_type: 'ngram'
				},
				success: function(data){
					//movies array to store all search terms
					var movies= [];
					//.each to loop through array of search results
					//index grabs element from array 
					//value is the object's value
					$.each(data.results, function(index, value){
						//object for what info we need
						var movieObject = {
							id: value.id,
							label:value.title
						};
						//push movieObject values into movies array
						movies.push(movieObject);
					});
					//call back function that triggers the drop down list of search terms
					response(movies);
				}
			});
		}
	})
});