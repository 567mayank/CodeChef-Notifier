const checkForElement = () => {
  const dataElement = document.querySelector('h3');
  if (dataElement) {
    const data = dataElement.innerText;
    // console.log('Data:', data);
    const dataToSend = { message: "Question Name", data: data };
    chrome.runtime.sendMessage(dataToSend, () => {});
    clearInterval(intervalId); // Stop checking once we find the element
  }
};
const intervalId = setInterval(checkForElement, 500);