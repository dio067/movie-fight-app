const fetchData = async (searchTerm) => {
    const res = await axios.get('http://www.omdbapi.com/', {
        params:{
            apikey:'fdb5cf6d',
            s: searchTerm,
        }
    }
)
    console.log(res.data);
}

let timeoutId;
const onInput = e => {
  if(timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    fetchData(e.target.value)
  },500)
}
const input = document.querySelector('input');
input.addEventListener('input', onInput)