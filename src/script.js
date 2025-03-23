const fetchData = async () => {
    const res = await axios.get('http://www.omdbapi.com/', {
        params:{
            apikey:'fdb5cf6d',
            s: 'avengers'
        }
    }
)
    console.log(res.data);
}
fetchData();