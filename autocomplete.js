const CreateAutoComplete= ({
    root,
    renderOption,
    onOptionSelects,
    inputValue,
    fetchOption,
     })=>{
    root.innerHTML=`<label><b>Search</b></label>
    <input class="input"/>
    <div class='dropdown'>
    <div class='dropdown-menu'>
    <div class='dropdown-content results'></div>
    </div>
    </div>`
    const input=root.querySelector('input');
    const dropdown=root.querySelector('.dropdown');
    const resultWrapper=root.querySelector('.results');
    
    const getSearch=async e=>{
        const items= await fetchOption(e.target.value)
        
      if(!items.length){
            dropdown.classList.remove('is-active')
           return
        } 
        resultWrapper.innerHTML='';
        dropdown.classList.add('is-active');
        for(let item of items){
           
            const option=document.createElement('a')
            option.classList.add('dropdown-item')
            option.innerHTML=renderOption(item);
            option.addEventListener('click',()=>{
                dropdown.classList.remove('is-active')
                input.value=inputValue(item)
                onOptionSelects(item.imdbID);
                
            })
    
            resultWrapper.appendChild(option)
        }
    }
   
    input.addEventListener('input',debounce(getSearch,500))
document.addEventListener('click',e=>{
    if(!root.contains(e.target)){
        dropdown.classList.remove('is-active');
    }
     else if(e.target==input &&e.target.value!=''){
        dropdown.classList.add('is-active');

    } 
})
}