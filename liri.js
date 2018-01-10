var myKeys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");

var fs = require("fs");

//Twitter Keys
var consumerKey = myKeys.tKeys.consumer_key;
var consumerSecret = myKeys.tKeys.consumer_secret;
var accessKey = myKeys.tKeys.access_token_key;
var accessSecret = myKeys.tKeys.access_token_secret;

//Spotify Keys
var clientID = myKeys.sKeys.client_id;
var clientSecret = myKeys.sKeys.client_secret;

//Parameter variables
var action = "";
var action_text = "";

//Get the arguments
action = process.argv[2];
action_text = process.argv[3];

//console.log(action_text);
//console.log(process.argv[3]);

doSomething(action,action_text);


//event based processing based on imput parameters
function doSomething(event,params){

	// console.log(event);
	// console.log(params);

	if (event == "my-tweets") {
		getTwitter();
	} else if (event == "spotify-this-song") {

		// if no song is passed in for Spotify then get I saw the sign by Ace of Base
		if (params == undefined) {
			params = "Ace of Base";
		}	
		getSpotify(params);
		//console.log(action_text)
	} else if (event == "movie-this") {
		// if no movie is passed in for OMDB then get the info for mr nobody
		if (params == undefined) {
			params = "Mr. Nobody";
		}	
		getOMDB(params);
	} else if (event == "do-what-it-says") {
		processFile();
	}	
}


// Twitter
function getTwitter() {

	var client = new Twitter({
	  consumer_key: consumerKey,
	  consumer_secret: consumerSecret,
	  access_token_key: accessKey,
	  access_token_secret: accessSecret
	});
	 
	var params = {screen_name: 'JoeSchmoe1212', count: 20};
	var tweetCount = 20
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
  		//console.log(JSON.stringify(tweets, null, 2));

  		for (var i = 0; i < tweets.length; i++) {
  			console.log(" Tweet " + tweetCount + ": " + tweets[i].text + " - Tweet Created: " + tweets[i].created_at);
  			tweetCount --;
  		}
	  }
	});
}


// Spotify
function getSpotify(songTitle) {

	var spotify = new Spotify({
	  id: clientID,
	  secret: clientSecret
	});
	 

	// do the Spotify search
	spotify.search({ type: 'track', query: songTitle }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
			//getSpotify("Ace of Base");
		}
		
		//console.log(data.tracks.items[0]);
		//console.log(data); 

    // * Artist(s)
     console.log("Artist: " + data.tracks.items[0].artists[0].name);
    //The song's name
     console.log("Song Name: " + data.tracks.items[0].name);
    //* A preview link of the song from Spotify
     console.log("Preview Link: " + data.tracks.items[0].preview_url);
    // * The album that the song is from	
    console.log("Album Name: " + data.tracks.items[0].album.name);	
	});
}

// OMDB
function getOMDB(movieName) {


	// Then run a request to the OMDB API with the movie specified
	request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

	// If the request is successful (i.e. if the response status code is 200)
	if (!error && response.statusCode === 200) {

		console.log("The movie's title is: " + JSON.parse(body).Title);
		console.log("The year the movie came out is: " + JSON.parse(body).Year);
		console.log("The IMDB rating of the movie is: " + JSON.parse(body).Rated);
		console.log("The Rotten Tomatoes Rating of the movie is: " + JSON.parse(body).Ratings[1].Value);
		console.log("The Country where the movie was produced is: " + JSON.parse(body).Country);
		console.log("The language of the movie is: " + JSON.parse(body).Language);
		console.log("The plot of the movie is: " + JSON.parse(body).Plot);
		console.log("The actors in the movie are: " + JSON.parse(body).Actors);

	}
	});	
}


function processFile(){

	fs.readFile("random.txt", "utf8", function(error, data) {

	  // If the code experiences any errors it will log the error to the console.
	  if (error) {
	    return console.log(error);
	  }

	  // Then split it by commas (to make it more readable)
	  var dataArr = data.split(",");

	  // We will then re-display the content as an array for later use.
	  // console.log(dataArr);

	  var processAction = dataArr[0];
	  var processActionText = dataArr[1];

	  doSomething(processAction,processActionText);

	});	
}