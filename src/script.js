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
<input class="input"/>
<div class="dropdown">
<div class="dropdown-menu>
  <div class="dropdown-content results></div>
    </div>
</div>
`;

const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const onInput = async e => {
 const movies = await fetchData(e.target.value)
 console.log(movies);
 for(let movie of movies){
    const div = document.createElement('div');
    div.innerHTML = `<img src="${movie.Poster}"/>
    <h1>${movie.Title}</h1>`
    document.querySelector('#target').appendChild(div);

 }
}
input.addEventListener('input', debounce(onInput,1000)) 