//Api keys and other needed information
const movieApiKey = 'api_key=f565fbe8e4c3d996435b7ecb4cbacbc0'
const movieBaseUrl = 'https://api.themoviedb.org/3/search/movie'
const movieSearchUrl = 'https://api.themoviedb.org/3/movie/'
const movieAdditionalQs = '&page=1&include_adult=false'
const posterBaseUrl = 'https://image.tmdb.org/t/p/w500/'

const songBaseUrl ='http://ws.audioscrobbler.com/2.0/?method=track.search&track='
const songSearchUrl = 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo'
const songApiKey ='&api_key=5693fd68291fa577eff3066dbff9bbc2'
const songAdditionalQs ='&format=json'

//Functions for movies and songs

function handleLetsGo() {
  // takes user to the next page
  $('#lets-go-button').click(function(event) {
    $('#main-page').removeClass('hidden')
    $('#welcome-page').addClass('hidden')
  })
}
function handleMediaChoice() {
  // shows choices when user wants to select movie or song
  $('#search-form').submit(function(event){
    event.preventDefault()
    userSearch = $('#user-search').val()
    encodedSearch = encodeURIComponent(userSearch)
    $('#results').removeClass('hidden')
    console.log(encodedSearch)
    if ($('input:checked').val() == 'Movie') {
      console.log('searching movies')
      fetchMovieData(encodedSearch)
    }
    else if ($('input:checked').val() == 'Song') {
      console.log('searching songs')
    }
  })
}



//movie search functions


function fetchMovieData(movieSearchData) {
  url = `${movieBaseUrl}?${movieApiKey}&language=en-US&query=${movieSearchData}${movieAdditionalQs}`
  fetch(url)
  .then(function(response){
    return response.json()
  })
  .then(function(responseJson) {
    getSpecificMovie(responseJson)
  })
}
function getSpecificMovie(data) {
  movieId = data.results[0].id
  idUrl = `${movieSearchUrl}${movieId}?${movieApiKey}&language=en-US&append_to_response=similar,credits`
  fetch(idUrl)
  .then(function(response){
    return response.json()
  })
  .then(function(responseJson){
    console.log(responseJson)
    formatMovieData(responseJson)
  })
}

function formatMovieData(data) {
  releaseDate = (data.release_date)
  
  

  director = data.credits.crew[0].name

  castOne = data.credits.cast[0].name
  castTwo = data.credits.cast[1].name
  castThree = data.credits.cast[2].name
  castList = `${castOne}, ${castTwo}, ${castThree}`

  overView = data.overview

  simOne = data.similar.results[0].title
  simTwo = data.similar.results[1].title
  simThree = data.similar.results[2].title
  simList = `${simOne}, ${simTwo}, ${simThree}`

  displayMovieData(releaseDate, director, castList, overView, simList, data)
}
function displayMovieData(release, director, cast, overView, similar, data) {
  $('#results').append(`<div id="release-div">Released in: <span id="year-text">${release}</span></div>`)
  $('#results').append(`<img  src="${displayMovieImage(data)}" alt="" id="search-image"></img>`)
  $('#results').append(`<div id="director"><span id="director-text">Director: ${director}</span></div>`)
  $('#results').append(`<div id="cast"<span id="cast-text">Cast: ${cast}</span></div>`)
  $('#results').append(`<p id="synopysis-div">Synopysis: ${overView} <span id="synopsis-text"></span></p>`)
  $('#results').append(`<div id="see-also-div">See also: <span id="see-also-text">${similar}</span></div>`)
  
}
function displayMovieImage(imageData){
  posterPath = imageData.poster_path
  posterUrl = `${posterBaseUrl}${posterPath}`
  return posterUrl
}


//IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII

function callHandles(){
  handleLetsGo()
  handleMediaChoice()
}
$(callHandles)


