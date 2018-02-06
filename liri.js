require("dotenv").config();

//CONSTANTS
const request = require('request');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
const keys = require('./keys.js')
const fs = require('file-system');
const cmd = require('node-command-line');
const log = require('simple-node-logger').createSimpleLogger("log.txt");

//API KEYS
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

//TERMINAL USER INPUTS e.g. node[0] liri.js[1] liriRequest[2] searchQuery[3]
const liriRequest = process.argv[2];
const searchQuery = process.argv.slice(3).join(' ');

//THE SWITCH LINE
switch (liriRequest) {
    case "spotify-this-song":
        searchTrack();
        break;
    case "movie-this":
        searchFilm()
        break;
    case "my-tweets":
        fetchTweets();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        break;
}

//LIRI SEARCHES SPOTIFY FOR YOUR REQUESTED TRACK
function searchTrack() {
    if (searchQuery.length === 0) {
        searchQuery = "The Sign Ace of Base"
    }
    spotify.search({ type: 'track', query: searchQuery }, function (err, data) {
        if (err) {
            return console.log('Error: ' + err);
        }
        console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
        console.log(`Song: ${data.tracks.items[0].name}`);
        console.log(`Album: ${data.tracks.items[0].album.name}`);
        console.log(`Preview Link: ${data.tracks.items[0].preview_url}`);
    });
}

//LIRI SEARCHES OMBD FOR YOUR REQUESTED MOVIE
function searchFilm() {
    if (searchQuery.length === 0) {
        searchQuery = "Mr. Nobody"
    }
    request(`http://www.omdbapi.com/?t=${searchQuery}&plot=short&apikey=5d94fa00`, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(`Movie: ${JSON.parse(body).Title}`);
            console.log(`Starring: ${JSON.parse(body).Actors}`);
            console.log(`Year: ${JSON.parse(body).Year}`);
            console.log(`Origin: ${JSON.parse(body).Country}`);
            console.log(`Language: ${JSON.parse(body).Language}`);
            console.log(`IMDB Rating: ${JSON.parse(body).imdbRating}`);
            console.log(`Tomato-meter: ${JSON.parse(body).Ratings[1].Value}`);
            console.log(`Synopsis: ${JSON.parse(body).Plot}`);   
        }
    });
}

//LIRI SEARCHES SPOTIFY FOR YOUR REQUESTED TRACK
function fetchTweets() {
    var twitterUser = {screen_name: 'LiriBotBot'};
    client.get('statuses/user_timeline', twitterUser, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log("---------------------------------------------------")
                console.log(`Tweet #${i + 1}:`)
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
                console.log("---------------------------------------------------")
            }
        }
    });
}

//LIRI READS INSTRUCTIONS FROM TEXT FILES
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return log.info(err)
        };
        var randomRequest = data.split(",")[0];
        var randomQuery = data.split(",")[1];
        function runCommand() {
            cmd.run(`node liri.js ${randomRequest} ${randomQuery}`)
        }
        runCommand()
    });

}

//USER REQUEST LOG
log.info(`Request Log: ${liriRequest} ${searchQuery}`)