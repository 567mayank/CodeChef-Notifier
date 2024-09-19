const addElement = (className ="",innerText="",parent="",type="div") => {
  const div = document.createElement(type)
  if(className!=="") div.className = className
  if(innerText!=="") div.innerText = innerText
  if(parent!=="") parent.appendChild(div)
  return div
}

const styleUpdate = (result,div) => {
  if(result.toUpperCase()==="ACCEPTED"){
    div.style.color="green"
  }
  else if(result.toUpperCase()==="WRONG"){
    div.style.color="red"
  }
  else{
    div.style.color="yellow"
  }
}

const updateUI = () => {
  const qs = document.querySelector(".others");
  qs.innerText = "No Recent Submissions"; 
  qs.className="noRecSub"
};

const memoryCleaner = (btn) => {
  btn.addEventListener("click",(e)=>{
    chrome.storage.local.clear()
    updateUI()
  })
}


chrome.tabs.query({ active: true }, (tabs) => {
  const url = tabs[0].url;
  if (url.includes("codechef.com")) {
    let qs = document.querySelector(".others");
    qs.className=""

    chrome.storage.local.get(null, (res) => {
      let keys = Object.keys(res)
      let len = keys.length

      if(len===0) {
        addElement("noRecSub","No Recent Submissions",qs)
        return
      }

      const subHeading = addElement("subHeading","",qs)
      addElement("","Recent Submissions",subHeading) 
      memoryCleaner(addElement("btn","Clear",subHeading,"button"))

      let count = Math.min(5,len);
      for (let i=count-1;i>=0;i--) {
        const div = addElement("qList","",qs)
        const divChild1 = addElement("qName",res[keys[i]].name,div)
        const divChild2 = addElement("qresult",res[keys[i]].result.toUpperCase(),div)
        styleUpdate(res[keys[i]].result,divChild2)
      }

      // clearing other submissions
      for(let i=count;i<len;i++){
        chrome.storage.local.remove(keys[i]);
      } 
    });
  } 
  else {
    let qs = document.querySelector(".others")
    addElement("otherPage","Not a CodeChef page",qs)
  }

});