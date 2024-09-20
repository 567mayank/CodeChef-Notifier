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

const memoryCleaner = (btn) => {
  btn.addEventListener("click", (e) => {
    chrome.storage.local.clear(() => {
      updateUI(); 
    });
  });
};


chrome.tabs.query({ active: true }, (tabs) => {
  const url = tabs[0].url;
  if (url.includes("codechef.com")) {
    let qs = document.querySelector(".others");
    qs.innerHTML=""

    chrome.storage.local.get(null, (res) => {
      let keys = Object.keys(res)
      let len = keys.length

      if(len===0) {
        updateUI()
        return
      }

      const subHeading = addElement("subHeading","",qs)
      addElement("","Recent Submissions",subHeading) 
      memoryCleaner(addElement("btn","Clear",subHeading,"button"))

      for (let i=len-1;i>=Math.max(0,len-5);i--) {
        const div = addElement("qList","",qs)
        const divChild1 = addElement("qName",res[keys[i]].name,div)
        const divChild2 = addElement("qresult",res[keys[i]].result.toUpperCase(),div)
        styleUpdate(res[keys[i]].result,divChild2)
      }

      // clearing other submissions
      for(let i=0;i<Math.max(-1,len-5);i++){
        chrome.storage.local.remove(keys[i])
      }
    
    });
  } 
  else {
    let qs = document.querySelector(".others")
    addElement("otherPage","Not a CodeChef page",qs)
  }

});