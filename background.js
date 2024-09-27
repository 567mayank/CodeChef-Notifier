const targetPattern = "*://www.codechef.com/api/ide/submit*";

let questionName = "Question's Name"
let qsUrl = "https://www.codechef.com"
let freezeMode = false;

// starting extension
const getStarted = () => {
  chrome.storage.local.set({
    "mode":"dark",
    "notifications":true,
    "submissions":"five"
  },()=>console.log("Started Extension!!!"))
}

// for exttracting solution id
const extractSolutionID = (url) => {
  let num = "";
  for (const char of url) {
    if (char >= '0' && char <= '9') num += char;
  }
  return num;
}

// for extracting question name
const extractQuestionName = (title) => {
  const titleArray = title.split(' ');
  const index = titleArray.indexOf("Practice");
  if(index==-1) return
  let qsName = "";
  for(let i=0;i<index;i++) {
    qsName+=titleArray[i]
    qsName+=" "
  }
  questionName = qsName
}

const handleRequest = (details) => {
  activateFreezeMode(3000)
  if (details.url.startsWith("https://www.codechef.com/api/ide/submit?")) {
    const solutionId = extractSolutionID(details.url);
    console.log("got this time", solutionId); 

    if (solutionId) {
      chrome.storage.local.get([solutionId],(res)=>{
        let result=res[solutionId]
        if(!result){
          let questionDetails = {
            name : questionName,
            result : "Result Not Found",
            url:qsUrl
          }
          chrome.storage.local.set({ [solutionId]: questionDetails },()=>{
            qsSubmitted()
          });
        }
      }) 
    }
    
  }
};

chrome.webRequest.onBeforeSendHeaders.addListener(
  handleRequest,
  { urls: [targetPattern] },
  ["requestHeaders"]
);

const qsSubmitted = () => {
  chrome.storage.local.get(null,res=>{
    let key = Object.keys(res)
    key.forEach((val)=>{
      if(res[val].result==="Result Not Found"){
        let setIntervalId = setInterval(() => {
            fetch(`https://www.codechef.com/api/ide/submit?solution_id=${val}`)
              .then(response => response.json())
              .then(data => {
                console.log(`Result code: ${data.result_code}`);
                if (data.result_code !== "wait") {
                  console.log(`Successfully retrieved result: ${data.result_code}`);
                  let questionDetails = {
                    name : res[val].name,
                    result : data.result_code,
                    url:res[val].url
                  }
                  chrome.storage.local.set({[val]:questionDetails},()=>notifyUser(val))
                  clearInterval(setIntervalId);
                }
              })
              .catch(error => {
                console.error("Error while fetching data", error);
                fetchResult.inProgress = false; 
              });
          }, 2000);
        }
      })
    })
}

// notification code implemented
notifyUser = (solutionId) => {
  chrome.storage.local.get(null,(res)=>{
    if(!(res.hasOwnProperty("notifications"))||res["notifications"]){
      const title = `${res[solutionId].name} Result`;
      const message = `Result: ${res[solutionId].result || 'No result available'}`;
    
      chrome.notifications.create(solutionId,{
        type: 'basic',
        iconUrl: 'images/icon48.png',
        title: title,
        message: message,
        priority: 2,
      }, (notificationId) => {
        console.log(`Notification sent with ID: ${notificationId}`);
      });
    }
  })
}

chrome.notifications.onClicked.addListener((notificationId) => {
  chrome.storage.local.get(notificationId,(res)=>{
    console.log(res[notificationId].url)
    chrome.tabs.create({ url: res[notificationId].url }); 
    chrome.notifications.clear(notificationId);
  })
});


// retreiving tab details
const handleTab = (tabId) => {
  if (freezeMode) return;
  chrome.tabs.get(tabId, (tab) => {
    qsUrl = tab.url
    extractQuestionName(tab.title);
  });
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  const tabId = activeInfo.tabId;
  handleTab(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    handleTab(tabId);
  }
});

// implemented freeze mode
const activateFreezeMode = (duration) => {
  freezeMode = true;
  setTimeout(() => {
    freezeMode = false; 
  }, duration);
};



getStarted()