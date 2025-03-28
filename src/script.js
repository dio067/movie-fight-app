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
const debounce = (func) => {
    let timeoutId;
    return (...args) => {
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() =>{
            func.apply(null,args)
        },1000)
    }
}
let timeoutId;
const onInput = e => {
 fetchData(e.target.value)
}
const input = document.querySelector('input');
input.addEventListener('input', debounce(onInput))