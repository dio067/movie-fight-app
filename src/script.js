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

    inputValue : (movie) => {
        return movie.Title;
    }
    
}
createAutoComplete({
    root: document.querySelector('#left-autocomplete'),
    onSelectOption : (movie) => {
      movieSelected (movie,document.querySelector('#left-summary'),'left');
      document.querySelector('.tutorial').classList.add('is-hidden');
    },
    ...autoCompleteConfig
});

createAutoComplete({
    root: document.querySelector('#right-autocomplete'),
    onSelectOption : (movie) => {
      movieSelected(movie,document.querySelector('#right-summary'),'right');
      document.querySelector('.tutorial').classList.add('is-hidden');
    },
    ...autoCompleteConfig
});

let leftMovie;
let rightMovie;

const movieSelected = async (movie, summaryElement,side) => {
  const res =  await axios.get('http://www.omdbapi.com/', {
        params:{
            apikey:'fdb5cf6d',
            i: movie.imdbID
        }
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
      const leftSideStats = document.querySelectorAll('#left-summary .notification');
      const rightSideStats = document.querySelectorAll('#right-summary .notification');

      leftSideStats.forEach((leftStat,index) => {
        const rightStat = rightSideStats[index];
        
        const leftValue  = parseInt(leftStat.dataset.value);
        const rightValue = parseInt(rightStat.dataset.value);

        if(leftValue < rightValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
      })
       
    };

    const movieTemplate = movieDetail => {
        const dollars = movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,'')
        const metascore = parseInt(movieDetail.Metascore)
        const imdbRating = parseFloat(movieDetail.imdbRating);
        const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
        let count  = 0;
        const awards = movieDetail.Awards.split(' ').forEach((word) =>{
            const value = parseInt(word);
            if(!isNaN(value)){
                count = count + value;
            }
        
        });
        console.log(count);

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
          <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
          </article>
          <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
          </article>
          <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
          </article>
          <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
          </article>
          <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
          </article>
        `;
      };
      