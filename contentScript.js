(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];
  let currentVideoUrl = "";
  let tabTitle = "";
  let key = "youTube";

  const fetchBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(key).then((result) => {
        resolve(result[key] ? result[key] : "{}");
      });
    });
  };

  const addNewBookmarkEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;

    currentVideoBookmarks = await fetchBookmarks();
    currentVideoBookmarks = JSON.parse(currentVideoBookmarks);

    if (typeof currentVideoBookmarks[currentVideo] === "undefined") {
      currentVideoBookmarks[currentVideo] = {
        url: currentVideoUrl,
        videoId: currentVideo,
        desc: tabTitle,
      };
      let testPrefs = JSON.stringify(currentVideoBookmarks);
      var jsonfile = {};
      jsonfile[key] = testPrefs;
      chrome.storage.sync.set(jsonfile);
      currentVideoBookmarks = await fetchBookmarks();
    } else {
      currentVideoBookmarks = await fetchBookmarks();
    }

  };

  const newVideoLoaded = async () => {
    const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

    currentVideoBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img");

      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkBtn.className = "ytp-button " + "bookmark-btn";
      bookmarkBtn.title = "Click to bookmark current video";

      youtubeLeftControls =
        document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName("video-stream")[0];

      youtubeLeftControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);

    }
  };

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, videoId, videoURL, title, value } = obj;

    if (type === "NEW") {
      currentVideo = videoId;
      currentVideoUrl = videoURL;
      tabTitle = title;
      const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
      if (!bookmarkBtnExists) {
        newVideoLoaded();
      }
    } else if (type === "PLAY") {
      window.location.href = videoURL;
    } else if (type === "DELETE") {
      let bookMarkAfterdel = "";
      bookMarkAfterdel = JSON.parse(currentVideoBookmarks);
      delete bookMarkAfterdel[videoId];
      let testPrefs = JSON.stringify(bookMarkAfterdel);
      var jsonfile = {};
      jsonfile[key] = testPrefs;
      chrome.storage.sync.set(jsonfile);
      response(testPrefs);

    }
  });
})();

const getTime = (t) => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().substr(11, 8);
};
