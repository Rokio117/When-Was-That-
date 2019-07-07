//Api keys and other needed information
const movieApiKey = "api_key=f565fbe8e4c3d996435b7ecb4cbacbc0";
const movieBaseUrl = "https://api.themoviedb.org/3/search/movie";
const movieSearchUrl = "https://api.themoviedb.org/3/movie/";
const movieAdditionalQs = "&page=1&include_adult=false";
const posterBaseUrl = "https://image.tmdb.org/t/p/w500/";

const songBaseUrl =
  "https://ws.audioscrobbler.com/2.0/?method=track.search&track=";
const songSearchUrl = "https://ws.audioscrobbler.com/2.0/?method=track.getInfo";
const similarSongUrl =
  "https://ws.audioscrobbler.com/2.0/?method=track.getsimilar";
const songApiKey = "&api_key=5693fd68291fa577eff3066dbff9bbc2";
const songAdditionalQs = "&format=json";
const errorMessage = `Sorry, an error occured. Please try again later.`


//Functions for movies and songs

function handleLetsGo() {
  // takes user to the next page
  $("#lets-go-button").click(function(event) {
    $("#main-page").removeClass("hidden");
    $("#welcome-page").addClass("hidden");
  });
}

function handleMediaChange() {
  $('.media-button').click(function(event) {
    event.preventDefault()
    console.log('handleMediaChange Ran')
  if ($(this).not('.selected')) {
    $('.media-button').toggleClass('selected')
    $('.media-button').toggleClass('not-selected')
  }
})
}

function handleMediaChoice() {
  // shows choices when user wants to select movie or song
  $("#search-form").submit(function(event) {
    event.preventDefault();
    $('#results').empty();
    $('#not-what-wanted').empty();
    $('#see-also-text').empty();
    userSearch = $("#user-search").val();
    $('#user-search').val('')
    $('#user-search').attr('placeholder', userSearch)
    encodedSearch = encodeURIComponent(userSearch);
    $("#results").removeClass("hidden");


    if ($('#movie-button').hasClass('selected')) {
      fetchMovieData(encodedSearch);
    } else {
      fetchSongData(encodedSearch);
    }
  });
}

//movie search functions

function fetchMovieData(movieSearchData) {
  url = `${movieBaseUrl}?${movieApiKey}&language=en-US&query=${movieSearchData}${movieAdditionalQs}`;
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(responseJson) {
      console.log("first search", responseJson);
      if (responseJson.results.length) {
        movieId = responseJson.results[0].id
        getSpecificMovie(movieId);
        getAlternateMovieSearches(responseJson);
      } else {
        noResults = `<div id="no-results-message"> Sorry, we couldn't find any searches for "${$('#user-search').val()}".
        Make sure your spelling is correct, and you selected the right media type, then try again.`

        $('#results').append(noResults)
      }
    })
    .catch(error => {
      console.log(error)
      $('#results').append(errorMessage)
    })
}

function getSpecificMovie(data) {
  //movieId = data.results[0].id;
  idUrl = `${movieSearchUrl}${data}?${movieApiKey}&language=en-US&append_to_response=similar,credits`;
  fetch(idUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(responseJson) {
      console.log("specific search", responseJson);
      formatMovieData(responseJson);
    });
}

function formatMovieData(data) {
  releaseDate = data.release_date;
  if (data.credits.crew.length) {
    director = data.credits.crew[0].name;
  }
  if (data.credits.cast.length >= 3) {
    castOne = data.credits.cast[0].name;
    castTwo = data.credits.cast[1].name;
    castThree = data.credits.cast[2].name;
    castList = `${castOne}, ${castTwo}, ${castThree}`;
  }
  overView = data.overview;
  if (data.similar.results.length >= 3) {
    simOne = data.similar.results[0];
    simOneButton = `<button class="new-search" value="${simOne.id}">${simOne.title}</button>`;
    simTwo = data.similar.results[1];
    simTwoButton = `<button class="new-search" value="${simTwo.id}">${simTwo.title}</button>`;
    simThree = data.similar.results[2];
    simThreeButton = `<button class="new-search" value="${simThree.id}">${simThree.title}</button>`;
    simList = `${simOneButton}${simTwoButton}${simThreeButton}`;
  }
  displayMovieData(releaseDate, director, castList, overView, simList, data);
}

function displayMovieData(release, director, cast, overView, similar, data) {
  const movieData = [
    `<div id="release-div" class="identifier" >Released in: </div><span id="year-text" class="response">${release}</span>`,
    `<img  src="${displayMovieImage(data)}" alt="" id="search-image"></img>`,
    `<div id="director" class="identifier">Director: </div><span id="director-text" class="response">${director}</span>`,
    `<div id="cast" class="identifier">Cast: </div><span id="cast-text" class="response">${cast}</span>`,
    `<div id="synopysis-div" class="identifier">Synopysis: </div><p id="synopsis-text" class="response">${overView}</p>`,
    `<div id="see-also-div" class="identifier">See also: </div><span id="see-also-text" class="response">${similar}</span>`,
  ];
  $('#results').append(movieData);
}

function displayMovieImage(imageData) {
  posterPath = imageData.poster_path;
  posterUrl = `${posterBaseUrl}${posterPath}`;
  return posterUrl;
}

function getAlternateMovieSearches(response) {
  console.log('alt movie searches', response)
  altLength = response.results.length;
  altMov = [];
  if (altLength > 3) {
    responseLength = 3
    $("#not-wanted-div").removeClass("hidden");
    formatAltMovies(responseLength, response);
  }
  if (altLength == 3) {
  
    responseLength = 2;
    formatAltMovies(responseLength, response);
  }
  if (altLength === 2) {
   
    responseLength = 1;
    $("#not-wanted-div").removeClass("hidden");
    formatAltMovies(responseLength, response);
  }
  if (altLength === 1) {
  
    responseLength = 0;
    $("#not-wanted-div").addClass("hidden");
  }
  console.log('alternate movie object', altMov);
  displayAltMovies(altMov);
}

function formatAltMovies(movies, response) {
  console.log(response, 'response in formatAltMovies', movies)
  if (movies !== 0) {
    for (i = 1; i <= movies; i++) {
      altMov.push({
        name: `${response.results[i].title}`,
        id: `${response.results[i].id}`,
        date: `${response.results[i].release_date}`
      });
    }
  }
}



function displayAltMovies(altMovies) {

  const movies = altMovies.map(function(movie) {
    return `<button class="new-search" value="${movie.id}" class="response">${movie.name}, ${
      movie.date
    }</button>`;
  });
  $("#not-what-wanted").append(movies);
    
}


//Song search functions

function fetchSongData(songData) {
  url = `${songBaseUrl}${songData}${songApiKey}${songAdditionalQs}`;
  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(responseJson) {
      console.log('first song search json', responseJson)
      if (responseJson.results.trackmatches.track.length) {
        if (responseJson.results.trackmatches.track[0].mbid != "") {
          songData = responseJson;
          songNum = songData.results.trackmatches.track[0].mbid;
          getSpecificSong(songNum);
          getSimilarSongs(songNum);
          formatOtherSongs(responseJson);
        }
        else {
          console.log('no mbid worked')
          noMbidNumber(responseJson);
        }
    } else {
      noResults = `<div id="no-results-message" class="response"> Sorry, we couldn't find any searches for "${$('#user-search').val()}" in ${$('input:checked').val()}s.
        Make sure your spelling is correct, and you selected the right media type, then try again.`

        $('#results').append(noResults)
    }

    })
}

function noMbidNumber(song) {
  console.log(song)
  songData = song.results.trackmatches.track[0]
  noDateResponse = `<div id="no-date" class="response">Sorry, we could not retrieve the date for that track</div>`
  artistDisplay = `<div id="artist-name" class="identifier">Artist(s): </div><span class="response">${songData.artist}</span>`
  artistUrl = `<a href="${songData.url}" id="listen-link" target="blank" class="response">Listen at last.fm</a>`
  musicImg = songData.image[3]["#text"]
  $('#results').append(noDateResponse, artistDisplay, artistUrl)
  displayMusicImage(musicImg)
  formatOtherSongs(song);
  
}

function getSpecificSong(songNum) {
  songIdUrl = `${songSearchUrl}${songApiKey}&mbid=${songNum}${songAdditionalQs}`;

  fetch(songIdUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(responseJson) {
      displayMusicData(responseJson);
    });
}

function getSimilarSongs(data) {
  similarUrl = `${similarSongUrl}&mbid=${data}${songApiKey}${songAdditionalQs}`;
  fetch(similarUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(responsejson) {
      formatSimilarSongs(responsejson);
    });
}

function displayMusicData(musicData) {
  if ('wiki' in musicData.track) {
    $("#results").append(
    `<div id="published-in" class="identifier">Most recent publication/republication: </div><span class="response">${musicData.track.wiki.published}</span>`
    )}
  else {
    $("#results").append(
      `<div id="no-date" class="response">Sorry, we could not retrieve the date for that track</div>`)
  }
  musicImg = musicData.track.album.image[3]["#text"];
  $("#results").append(
    `<div id="artist-name" class="identifier">Artist(s): </div><span class="response">${musicData.track.artist.name}</span>`
  );
  $("#results").append(
    `<div id="album-name" class="identifier">Album: </div><span class="response">${musicData.track.album.title}</span>`
  );
  $("#results").append(
    `<a href="${
      musicData.track.url
    }" id="listen-link" target="blank" class="response">Listen at last.fm</a>`
  );
  displayMusicImage(musicImg);
}

function formatOtherSongs(data) {
  $('#not-wanted-div').removeClass('hidden')
  otherLength = data.results.trackmatches.track.length;
  if (otherLength >= 3) {
    otherSongs = 3;
    displayOtherSongs(otherSongs, data);
  }
  if (otherLength < 3) {
    otherSongs = otherLength;
    displayOtherSongs(otherSongs, data);
  }
}

function displayOtherSongs(num, data) {
  //$("#not-what-wanted").append(`<div id="not-wanted-div"></div>`);
  for (i = 1; i < num; i++) {
    $("#not-what-wanted").append(`<button class="new-search" class="response" value="${
      data.results.trackmatches.track[i].mbid
    }">${data.results.trackmatches.track[i].name} by 
    ${data.results.trackmatches.track[i].artist}</button>`);
  }
}

function formatSimilarSongs(simData) {
  simNum = simData.similartracks.track.length;
  if (simNum >= 3) {
    simNumDisplay = 3;
    displaySimilarSongs(simNumDisplay, simData);
  }
  if (simNum < 3) {
    simNumDisplay = simNum;
    displaySimilarSongs(simNumDisplay, simData);
  }
}

function displaySimilarSongs(number, data) {
  $("#results").append(`<div id="try-similar">Similar Songs: </div>`);
  for (i = 0; i < number; i++) {
    $("#try-similar").append(`<button class="new-search" class="response" value="${
      data.similartracks.track[i].mbid
    }">${data.similartracks.track[i].name} by 
    ${data.similartracks.track[i].artist.name}</button>`);
  }
}

function displayMusicImage(musicImgSrc) {
  $("#results").append(`<img src="${musicImgSrc}"</img>`);
}

//IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII

function handleNewSearch(searchParam) {
  $("main").on("click", ".new-search", function(event) {
    if ($('#movie-button').hasClass('selected')) {
      newSearch = $(this).val();
      searchText = $(this).text();
      textOnly = searchText.replace(/-/g, '').replace(/,/g, '')
      $("#results").empty();
      $("#not-what-wanted").empty();
      $("#not-what-wanted").addClass('hidden');
      $("#not-wanted-div").addClass('hidden');
      $('#user-search').val('');
      $("#user-search").attr('placeholder', searchText);
      

      //fetchMovieData(encodedSearch);
      getSpecificMovie(newSearch)
    } else {
      songVal = $(this).val();
      searchText = $(this).text();
      $("#results").empty();
      $("#not-wanted-div").empty();
      $('#not-what-wanted').empty();
      $("#user-search").attr('placeholder', searchText)
      getSpecificSong(songVal);
      getSimilarSongs(songVal);
    }
  });
}

function callHandles() {
  handleLetsGo();
  handleMediaChoice();
  handleNewSearch();
  handleMediaChange();
}
$(callHandles);
