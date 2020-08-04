
   const config={
    renderOption(movie){
        const imgSrc=movie.Poster==='N/A'?"":movie.Poster;
        return`
        <img src="${imgSrc}"/>
            <h1>${movie.Title} ${movie.Year}</h1>
        `
    },
    inputValue(movie){
        return movie.Title
    },
    async fetchOption(search){
        const response= await axios.get('http://www.omdbapi.com/',{
            params:{
                apikey:'43501b10',
                s:search
            }
        })
        if(response.data.Error){
            return[]
        }
        
        return response.data.Search
    
        
    }
   }
   CreateAutoComplete({
       ...config,
    root:document.querySelector('#left-autocomplete'),
    onOptionSelects(movie)
    {
        onMovieselect(movie,document.querySelector("#left-summary"),'leftSide')
        document.querySelector('.tutorial').classList.add('is-hidden')
    } 
   })
   CreateAutoComplete({
       ...config,
    root:document.querySelector('#right-autocomplete'),
    onOptionSelects(movie)
    {
        onMovieselect(movie,document.querySelector("#right-summary"),'rightSide')
        document.querySelector('.tutorial').classList.add('is-hidden')
    } 
   
   })
   let leftMovie;
   let rightMovie;
   const onMovieselect=async (movieId,summaryElement,side)=>{
    
    const response= await axios.get('http://www.omdbapi.com/',{
        params:{
            apikey:'43501b10',
            i:movieId
        }
    })
    if(side==='leftSide'){
        leftMovie=response.data;
    }
    else if(side==='rightSide'){
        rightMovie=response.data
    }
summaryElement.innerHTML=movieTemplate(response.data);
if(leftMovie && rightMovie){
    compareMovies();
}
}
const compareMovies=()=>{
    const rightSideState=document.querySelectorAll('#right-summary .notification')
    const leftSideState=document.querySelectorAll('#left-summary .notification')

leftSideState.forEach((leftStat,index)=>{
    const rightStat=rightSideState[index];
    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);
    if(rightSideValue>leftSideValue){
        leftStat.classList.remove('is-primary');
        leftStat.classList.add('is-warning');
        rightStat.classList.remove('is-warning');
        rightStat.classList.add('is-primary');
    }
    else{
        rightStat.classList.remove('is-primary');
        rightStat.classList.add('is-warning');
        leftStat.classList.remove('is-warning');
        leftStat.classList.add('is-primary');

    }
})
}
const movieTemplate= movieDetail=>{
    const dollar=parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/\,/g,''));
    const metascore=parseInt(movieDetail.Metascore);
    const rating=parseFloat(movieDetail.imdbRating).toFixed(1);
    const votes=parseInt(movieDetail.imdbVotes.replace(/\,/g,''));
    const awards=movieDetail.Awards.split(' ').reduce((prev,word)=>{
       const  value=parseInt(word);
        if(isNaN(value)){
            return prev;
        }
        else{
            return prev+value;
        }
    },0)


    return `
    <artice class="media">
        <figure class="media-left">
          <p class="image">
            <img src="${movieDetail.Poster}"/>
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <h1>${movieDetail.Title}</h1>
            <h4>${movieDetail.Genre}</h4>
            <p>${movieDetail.Plot}</p>
          </div>
        </div>
</artice>
<article data-value=${awards} class="notification is-primary">
<p class="title">${movieDetail.Awards}</p>
<p class="subtitle">Awards</p>
</article>
<article data-value=${dollar} class="notification is-primary">
<p class="title">${movieDetail.BoxOffice}</p>
<p class="subtitle">Box Office</p>
</article>
<article  data-value=${metascore} class="notification is-primary">
<p class="title">${movieDetail.Metascore}</p>
<p class="subtitle">Metascore</p>
</article>
<article  data-value=${rating} class="notification is-primary">
<p class="title">${movieDetail.imdbRating}</p>
<p class="subtitle">IMDB Rating</p>
</article>
<article  data-value=${votes} class="notification is-primary">
<p class="title">${movieDetail.imdbVotes}</p>
<p class="subtitle">IMDB Votes</p>
</article>
    `
}

