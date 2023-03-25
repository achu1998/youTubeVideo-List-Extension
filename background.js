// chrome.webNavigation.onCompleted.addListener(function(details) {
//   chrome.tabs.query (
//     { currentWindow: true, active: true }, 
//     function(tabs) {
//         var tab = tabs[0];
//         if (tab.url && tab.url.includes("youtube.com/watch")) {
//           const queryParameters = tab.url.split("?")[1];
//           const urlParameters = new URLSearchParams(queryParameters);
//           let messParam = {
//             type: "NEW",
//             videoId: urlParameters.get("v"),
//             videoURL: tab.url,
//             title: tab.title,
//             value: "1"
//           }
//           chrome.tabs.sendMessage(tab.id, messParam);
//         }
//     }
//   );
// })
chrome.tabs.onUpdated.addListener((tabId, tab) => {
  chrome.tabs.query(
    { currentWindow: true, active: true },
    function (tabs) {
      var tab = tabs[0];
      if (tab.url && tab.url.includes("youtube.com/watch")) {
        const queryParameters = tab.url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);
        let messParam = {
          type: "NEW",
          videoId: urlParameters.get("v"),
          videoURL: tab.url,
          title: tab.title,
          value: "2"
        }
        chrome.tabs.sendMessage(tab.id, messParam);
      }
    }
  );
});
