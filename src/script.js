const autoCompleteConfig = {
    fetchData : async (searchTerm) => {
    const res = await axios.get('http://www.omdbapi.com/', {
        params:{
            apikey:'fdb5cf6d',
            s: searchTerm,
        }
    });
    if(res.data.Error){
        return [];
    }

    return res.data.Search;
    },

    renderOption : (movie) => {
    const imgSrc = movie.Poster === 'N/A' ? "" : movie.Poster;
    return `
    <img src="${imgSrc}"/>
       ${movie.Title} (${movie.Year})
    `;
    },

    onSelectOption : (movie) => {
        movieSelected(movie);
        document.querySelector('.tutorial').classList.add('is-hidden');

    },

    inputValue : (movie) => {
        return movie.Title;
    }
    
}
createAutoComplete({
    root: document.querySelector('#left-autocomplete'),
    ...autoCompleteConfig
});

createAutoComplete({
    root: document.querySelector('#right-autocomplete'),
    ...autoCompleteConfig
});

const movieSelected = async (movie) => {
  const res =  await axios.get('http://www.omdbapi.com/', {
        params:{
            apikey:'fdb5cf6d',
            i: movie.imdbID
        }
    });
    document.querySelector('.summary').innerHTML = movieTemplate(res.data);
}

const movieTemplate = (movieDetails) => {
    return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetails.Poster}">
        </p>
      </figure>
      <div>
         <h1>${movieDetails.Title}</h1>
         <h4>${movieDetails.Genre}</h4>
         <p>${movieDetails.Plot}</p>
      </div>
    </article>
      <article>
        <p class="title">${movieDetails.Awards}</p>
        <p class="subtitle">Awards</p>
      </article>
      <article>
        <p class="title">${movieDetails.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
      </article>
      <article>
        <p class="title">${movieDetails.Metascore}</p>
        <p class="subtitle">Meta Score</p>
      </article>
      <article>
        <p class="title">${movieDetails.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
      </article>
      <article>
        <p class="title">${movieDetails.imdbVotes}</p>
        <p class="subtitle">IMDB votes</p>
      </article>`
    
};