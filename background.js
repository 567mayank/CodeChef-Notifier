const targetPattern = "*://www.codechef.com/api/ide/submit*";

// "https://www.codechef.com/api/ide/submit?solution_id=1089386436"
const extractSolutionID = (url) => {
  let num="";
  let i=0;
  for (const char of url) {
    if(char>='0'&&char<='9') num+=char;
  }
  return num;
}


const handleRequest = (details) => {

  if (details.url.startsWith("https://www.codechef.com/api/ide/submit?")) {

    console.log("got this time");
    const solutionId = extractSolutionID(details.url);

    if (solutionId) {
      chrome.storage.local.get(["requests"], (result) => {
        const requests = result.requests || {};

        if (!requests[solutionId]) {
          const csrfTokenHeader = details.requestHeaders.find(header => header.name.toLowerCase() === 'x-csrf-token');
          const csrfToken = csrfTokenHeader ? csrfTokenHeader.value : null;
          requests[solutionId] = csrfToken;

          chrome.storage.local.set({ requests }, () => {
            
            console.log(`Stored solution ID: ${solutionId} with CSRF Token: ${csrfToken}`);

            fetchResult(solutionId, csrfToken);
            notifyUser(solutionId);
          });
        }
      });

    }
  }
};

chrome.webRequest.onBeforeSendHeaders.addListener(
  handleRequest,
  { urls: [targetPattern] },
  ["requestHeaders"]
);


function fetchResult(solutionId, csrfToken) {
  fetch(`https://www.codechef.com/api/ide/submit?solution_id=${solutionId}`)
  .then((response)=>{
    return response.json();
  })
  .then((data)=>console.log(data));
  // console.log(`Fetching result for solution ID: ${solutionId}`);
}

function notifyUser(solutionId) {
  
}