const fetchData = async (searchTerm) => {
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
};

const root = document.querySelector('.autocomplete')
root.innerHTML = `<label><b>Search For a Movie</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content" id="results"></div>
    </div>
  </div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('#results');

const onInput = async e => {
 const movies = await fetchData(e.target.value)

 if(!movies.length){
    dropdown.classList.remove('is-active');
    return;
 }

 console.log(movies);
 resultsWrapper.innerHTML = '';
 dropdown.classList.add('is-active');

 for(let movie of movies){
    const option = document.createElement('a');
    const imgSrc = movie.Poster === 'N/A' ? "" : movie.Poster;

    option.classList.add('dropdown-item')
    option.innerHTML = `<img src="${imgSrc}"/>
       ${movie.Title}
    `;

    option.addEventListener('click', e => {
        dropdown.classList.remove('is-active');
        input.value = movie.Title;
        movieSelected(movie); // helper function to request data for selected movie

    })

    console.log(option);
    resultsWrapper.appendChild(option);

 }
}
input.addEventListener('input', debounce(onInput,1000))
document.addEventListener('click', e => {
    if(!root.contains(e.target)){
        dropdown.classList.remove('is-active');
    }
})

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
    </article>`
};