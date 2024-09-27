// mode ui updatation
const modeSwitched = () =>{
  chrome.storage.local.get(null,(res)=>{
    if(res["mode"]==="dark") {
      document.querySelector(`#${res["mode"]}`).style.backgroundColor="#434040"
      document.getElementById('settingsIcon').src = "/images/backWhite.png"
    }
    else {
      document.querySelector(`#${res["mode"]}`).style.backgroundColor="#cdcdcd"
      document.getElementById('settingsIcon').src = "/images/backBlack.png"
    } 
    lastSubSwitched()
    Array.from(document.querySelectorAll(".modeUpdatation")).forEach((val)=>{
      val.classList.remove("light")
      val.classList.remove("dark")
      val.classList.add(res["mode"])
    })
  })
}
let modes = Array.from(document.querySelector(".mode").children)
modes.forEach(val => {
  val.addEventListener("click",()=>{
    modes.forEach(val=>document.querySelector(`#${val.id}`).style.backgroundColor="")
    chrome.storage.local.set({"mode":val.id},()=>console.log("Mode Switched"))
    modeSwitched()
  })
});


// Notifications ui updatation
const checkbox = document.querySelector("#checkbox");
const notificationChecked = () => {
  chrome.storage.local.get("notifications",(res)=>{
    checkbox.checked=res["notifications"]
  })
}
checkbox.addEventListener("click", () => {
  chrome.storage.local.set({"notifications":checkbox.checked},()=>console.log("checkbox toggled"))
});


// Last submission ui updatation
const lastSubSwitched = () =>{
  chrome.storage.local.get(null,(res)=>{
    if(res["mode"]==="dark") document.querySelector(`#${res["submissions"]}`).style.backgroundColor="#434040"
    else document.querySelector(`#${res["submissions"]}`).style.backgroundColor="#cdcdcd"
  })
}
let lastSub = Array.from(document.querySelector(".submission").children)
lastSub.forEach(val => {
  val.addEventListener("click",()=>{
    lastSub.forEach(val=>document.querySelector(`#${val.id}`).style.backgroundColor="")
    chrome.storage.local.set({"submissions":val.id},()=>console.log("last Submissions Switched"))
    lastSubSwitched()
  })
});

modeSwitched()
notificationChecked()
lastSubSwitched()