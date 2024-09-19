const addElement = (className,innerText,parent) => {
  const div = document.createElement('div')
  div.className = className
  div.innerText = innerText
  parent.appendChild(div)
  return div
}

chrome.tabs.query({ active: true }, (tabs) => {
  const url = tabs[0].url;
  if (url.includes("codechef.com")) {
    let qs = document.querySelector(".others");
    chrome.storage.local.get(null, (res) => {
      if(res.length===0) {
        qs.innerText="No Recent Submissions"
        return
      }
      const subHeading = addElement("subHeading","Recent Submissions",qs) 
      qs.appendChild(subHeading)
      let count = 5;
      for (let val in res) {
        const div = document.createElement('div')
        const divChild1 = document.createElement('div');
        const divChild2 = document.createElement('div');
        divChild1.innerText = res[val].name
        divChild2.innerText = res[val].result
        div.appendChild(divChild1)
        div.appendChild(divChild2)
        div.className = "qList"
        qs.appendChild(div)
        if(!count--) break;
      }
    });
  } 
  else {
    let qs = document.querySelector(".others");
    qs.innerText = "Not a CodeChef page";
  }

});