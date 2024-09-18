const targetPattern = "*://www.codechef.com/api/ide/submit*";
let questionName
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
    console.log("got this time", solutionId); // Log the solutionId

    if (solutionId) {
      chrome.storage.local.get([solutionId],(res)=>{
        let result=res[solutionId]
        if(!result){
          chrome.storage.local.set({ [solutionId]: "Result Not Found" });
          if (!fetchResult.inProgress) {
            fetchResult.inProgress = true; // Set flag to indicate fetching is in progress
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
          chrome.storage.local.set({[solutionId]:data.result_code},()=>{})
          notifyUser(data);
          clearInterval(setIntervalId);
          fetchResult.inProgress = false; // Reset flag after completion
        }
      })
      .catch(error => {
        console.error("Error while fetching data", error);
        fetchResult.inProgress = false; // Reset flag on error
      });
  }, 2000);
}

function notifyUser(data) {
  const title = `${questionName} Result`;
  const message = `Result: ${data.result_code || 'No result available'}`;

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon.png',
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

chrome.storage.local.clear(()=>{})