const targetPattern = "*://www.codechef.com/api/ide/submit*";
let questionName = "Question's Name"

const extractSolutionID = (url) => {
  let num = "";
  for (const char of url) {
    if (char >= '0' && char <= '9') num += char;
  }
  return num;
}

const handleRequest = (details) => {
  if (details.url.startsWith("https://www.codechef.com/api/ide/submit?")) {
    const solutionId = extractSolutionID(details.url);
    console.log("got this time", solutionId); 

    if (solutionId) {
      chrome.storage.local.get([solutionId],(res)=>{
        let result=res[solutionId]
        if(!result){
          let questionDetails = {
            name : questionName,
            result : "Result Not Found"
          }
          chrome.storage.local.set({ [solutionId]: questionDetails });
          if (!fetchResult.inProgress) {
            fetchResult.inProgress = true; 
            fetchResult(solutionId);
          }
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

let setIntervalId;

function fetchResult(solutionId) {
  setIntervalId = setInterval(() => {
    fetch(`https://www.codechef.com/api/ide/submit?solution_id=${solutionId}`)
      .then(response => response.json())
      .then(data => {
        console.log(`Result code: ${data.result_code}`);
        if (data.result_code !== "wait") {
          console.log(`Successfully retrieved result: ${data.result_code}`);
          let questionDetails = {
            name : questionName,
            result : data.result_code
          }
          chrome.storage.local.set({[solutionId]:questionDetails})
          notifyUser(data);
          clearInterval(setIntervalId);
          fetchResult.inProgress = false; 
        }
      })
      .catch(error => {
        console.error("Error while fetching data", error);
        fetchResult.inProgress = false; 
      });
  }, 2000);
}

function notifyUser(data) {
  const title = `${questionName} Result`;
  const message = `Result: ${data.result_code || 'No result available'}`;

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'images/notificationIcon.png',
    title: title,
    message: message,
    priority: 2,
  }, (notificationId) => {
    console.log(`Notification sent with ID: ${notificationId}`);
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);
  if (request.message === "Question Name") {
    console.log(request.data)
    questionName = request.data
  }
});