const autoCompleteConfig = {
  fetchData: async (searchTerm) => {
    const res = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'fdb5cf6d',
        s: searchTerm,
      },
    });

    if (res.data.Error) {
      return [];
    }

    return res.data.Search;
  },

  renderOption: (movie) => {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
      <img src="${imgSrc}" />
      ${movie.Title} (${movie.Year})
    `;
  },

  inputValue: (movie) => movie.Title,
};

// Left autocomplete
createAutoComplete({
  root: document.querySelector('#left-autocomplete'),
  onSelectOption: (movie) => {
    movieSelected(movie, document.querySelector('#left-summary'), 'left');
    document.querySelector('.tutorial').classList.add('is-hidden');
  },
  ...autoCompleteConfig,
});

// Right autocomplete
createAutoComplete({
  root: document.querySelector('#right-autocomplete'),
  onSelectOption: (movie) => {
    movieSelected(movie, document.querySelector('#right-summary'), 'right');
    document.querySelector('.tutorial').classList.add('is-hidden');
  },
  ...autoCompleteConfig,
});

let leftMovie;
let rightMovie;

const movieSelected = async (movie, summaryElement, side) => {
  const res = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'fdb5cf6d',
      i: movie.imdbID,
    },
  });

  summaryElement.innerHTML = movieTemplate(res.data);

  if (side === 'left') {
    leftMovie = res.data;
  } else {
    rightMovie = res.data;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
};

const runComparison = () => {
  const leftStats = document.querySelectorAll('#left-summary .notification');
  const rightStats = document.querySelectorAll('#right-summary .notification');

  leftStats.forEach((leftStat, index) => {
    const rightStat = rightStats[index];
    const leftValue = parseFloat(leftStat.dataset.value);
    const rightValue = parseFloat(rightStat.dataset.value);

    if (rightValue > leftValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    } else {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  });
};

const movieTemplate = (movieDetail) => {
  const dollars = parseInt(movieDetail.BoxOffice?.replace(/\$/g, '').replace(/,/g, '')) || 0;
  const metascore = parseInt(movieDetail.Metascore) || 0;
  const imdbRating = parseFloat(movieDetail.imdbRating) || 0;
  const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, '')) || 0;

  let awardsCount = 0;
  const awardsWords = movieDetail.Awards?.split(' ') || [];
  awardsWords.forEach((word) => {
    const value = parseInt(word);
    if (!isNaN(value)) {
      awardsCount += value;
    }
  });

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value="${awardsCount}" class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value="${dollars}" class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
    <article data-value="${metascore}" class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value="${imdbVotes}" class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};
