//Api keys and other needed information
const movieApiKey = "api_key=f565fbe8e4c3d996435b7ecb4cbacbc0";
const movieBaseUrl = "https://api.themoviedb.org/3/search/movie";
const movieSearchUrl = "https://api.themoviedb.org/3/movie/";
const movieAdditionalQs = "&page=1&include_adult=false";
const posterBaseUrl = "https://image.tmdb.org/t/p/w500/";

const songBaseUrl =
  "http://ws.audioscrobbler.com/2.0/?method=track.search&track=";
const songSearchUrl = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo";
const similarSongUrl =
  "http://ws.audioscrobbler.com/2.0/?method=track.getsimilar";
const songApiKey = "&api_key=5693fd68291fa577eff3066dbff9bbc2";
const songAdditionalQs = "&format=json";

//Functions for movies and songs

function handleLetsGo() {
  // takes user to the next page
  $("#lets-go-button").click(function(event) {
    $("#main-page").removeClass("hidden");
    $("#welcome-page").addClass("hidden");
  });
}

function handleMediaChoice() {
  // shows choices when user wants to select movie or song
  $("#search-form").submit(function(event) {
    event.preventDefault();
    userSearch = $("#user-search").val();
    encodedSearch = encodeURIComponent(userSearch);
    $("#results").removeClass("hidden");

    if ($("input:checked").val() == "Movie") {
      fetchMovieData(encodedSearch);
    } else if ($("input:checked").val() == "Song") {
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
      getSpecificMovie(responseJson);
      getAlternateMovieSearches(responseJson);
    });
}

function getSpecificMovie(data) {
  movieId = data.results[0].id;
  idUrl = `${movieSearchUrl}${movieId}?${movieApiKey}&language=en-US&append_to_response=similar,credits`;
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
    simOne = data.similar.results[0].title;
    simOneButton = `<button class="new-search" value="${simOne}">${simOne}</button>`;
    simTwo = data.similar.results[1].title;
    simTwoButton = `<button class="new-search" value="${simTwo}">${simTwo}</button>`;
    simThree = data.similar.results[2].title;
    simThreeButton = `<button class="new-search" value="${simThree}">${simThree}</button>`;
    simList = `${simOneButton}${simTwoButton}${simThreeButton}`;
  }
  displayMovieData(releaseDate, director, castList, overView, simList, data);
}

function displayMovieData(release, director, cast, overView, similar, data) {
  const movieData = [
    `<div id="release-div">Released in: <span id="year-text">${release}</span></div>`,
    `<img  src="${displayMovieImage(data)}" alt="" id="search-image"></img>`,
    `<div id="director"><span id="director-text">Director: ${director}</span></div>`,
    `<div id="cast"<span id="cast-text">Cast: ${cast}</span></div>`,
    `<p id="synopysis-div">Synopysis: ${overView} <span id="synopsis-text"></span></p>`,
    `<div id="see-also-div">See also: <span id="see-also-text">${similar}</span></div>`,
  ];
  $('#results').append(movieData);
}

function displayMovieImage(imageData) {
  posterPath = imageData.poster_path;
  posterUrl = `${posterBaseUrl}${posterPath}`;
  return posterUrl;
}

function getAlternateMovieSearches(response) {
  altLength = response.results.length;
  altMov = [];
  if (altLength > 3) {
    responseLength = 4
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

  displayAltMovies(altMov);
}

function formatAltMovies(movies, response) {
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
    return `<button class="new-search" value="${movie[0]}">${movie[0]}, ${
      movie[1]
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
      songData = responseJson;
      console.log("first search", responseJson);
      songNum = songData.results.trackmatches.track[0].mbid;
      getSpecificSong(songNum);
      getSimilarSongs(songNum);
      formatOtherSongs(responseJson);
    });
}

function getSpecificSong(songNum) {
  songIdUrl = `${songSearchUrl}${songApiKey}&mbid=${songNum}${songAdditionalQs}`;

  fetch(songIdUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(responseJson) {
      console.log("second search", responseJson);

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
  $("#results").append(
    `<div id="published-in">Published: ${musicData.track.wiki.published}</div>`
  );
  musicImg = musicData.track.album.image[3]["#text"];
  $("#results").append(
    `<div id="artist-name">Artist(s): ${musicData.track.artist.name}`
  );
  $("#results").append(
    `<div id="album-name">Album: ${musicData.track.album.title}`
  );
  $("#results").append(
    `<a href="${
      musicData.track.url
    }" id="listen-link" target="blank">Listen at last.fm</a>`
  );
  displayMusicImage(musicImg);
}

function formatOtherSongs(data) {
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
  $("#not-what-wanted").append(`<div id="not-wanted-div"></div>`);
  for (i = 1; i < num; i++) {
    $("#not-wanted-div").append(`<button class="new-search" value="${
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
    $("#try-similar").append(`<button class="new-search" value="${
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
    if ($("input:checked").val() == "Movie") {
      newSearch = $(this).val();
      encodedSearch = encodeURIComponent(newSearch);
      $("#results").empty();
      $("#not-what-wanted").empty();
      $("#user-search").val(newSearch);

      fetchMovieData(encodedSearch);
    } else if ($("input:checked").val() == "Song") {
      songVal = $(this).val();
      console.log(songVal);
      $("#results").empty();
      $("#not-wanted-div").empty();
      getSpecificSong(songVal);
      getSimilarSongs(songVal);
    }
  });
}

function callHandles() {
  handleLetsGo();
  handleMediaChoice();
  handleNewSearch();
}
$(callHandles);
