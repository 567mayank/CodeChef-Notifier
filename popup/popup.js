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
  qs.innerHTML=""
  addElement("noRecSub","No Submission Yet!!",qs);
};

const memoryCleanerManually = (btn,keys,len) => {
  btn.addEventListener("click", (e) => {
    console.log("hi")
    for(let i=0;i<len;i++){
      if (isNaN(Number(keys[i]))) continue;
      chrome.storage.local.remove(keys[i])
    }
    updateUI();
  });
};

const localStorageCleaner = () => {
  chrome.storage.local.get(null,res=>{
    let keys = Object.keys(res)
    let len = keys.length
    if(len>18){
      for(let i=0;i<len;i++){
        if (isNaN(Number(keys[i]))) continue;
        chrome.storage.local.remove(keys[i])
        break
      }
    }
  })
}

chrome.tabs.query({ active: true }, (tabs) => {
  const url = tabs[0].url;
  if (url.includes("codechef.com")) {
    let qs = document.querySelector(".others");
    qs.innerHTML=""

    chrome.storage.local.get(null, (res) => {
      let keys = Object.keys(res)
      let len = keys.length
      let lastSub = 5
      if(res["submissions"]==="ten") lastSub=10
      if(res["submissions"]==="fifteen") lastSub=15
      lastSub--;
      console.log(lastSub) 
      console.log(len)
      if(len===0) {
        updateUI()
        return
      }

      const subHeading = addElement("subHeading","",qs)
      addElement("","Recent Submissions",subHeading) 
      memoryCleanerManually(addElement("btn","Clear",subHeading,"button"),keys,len)
      let i=len-1;
      while(i>=0&&lastSub>=0){
        if (!isNaN(Number(keys[i]))) {
          console.log()
          const div = addElement("qList","",qs)
          const divChild1 = addElement("qName",res[keys[i]].name,div)
          const divChild2 = addElement("qresult",res[keys[i]].result.toUpperCase(),div)
          styleUpdate(res[keys[i]].result,divChild2)
          lastSub--;
        }
        i--;
      }
    
    });
  } 
  else {
    let qs = document.querySelector(".others")
    addElement("otherPage","Not a CodeChef page",qs)
  }

});

localStorageCleaner()