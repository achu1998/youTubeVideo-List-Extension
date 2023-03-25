import { getActiveTabURL } from "./utils.js";

let key = "youTube";

const addNewBookmark = (bookmarks, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const controlsElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");

  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";
  controlsElement.className = "bookmark-controls";

  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  newBookmarkElement.id = "bookmark-" + bookmark.videoId;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("url", bookmark.url);
  newBookmarkElement.setAttribute("videoId", bookmark.videoId);

  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlsElement);
  bookmarks.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks = "{}") => {
  const bookmarksElement = document.getElementById("bookmarks");
  bookmarksElement.innerHTML = "";
  currentBookmarks = JSON.parse(currentBookmarks);

  if (Object.keys(currentBookmarks).length > 0) {
    for (const [key, value] of Object.entries(currentBookmarks)) {
      addNewBookmark(bookmarksElement, value);
    }
  } else {
    bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
  }

  return;
};

const onPlay = async e => {
  const bookmarkUrl = e.target.parentNode.parentNode.getAttribute("url");
  const bookmarkVideoId = e.target.parentNode.parentNode.getAttribute("videoId");
  const activeTab = await getActiveTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    videoURL: bookmarkUrl,
    videoId: bookmarkVideoId
  });
};

const onDelete = async e => {
  const activeTab = await getActiveTabURL();
  const bookmarkUrl = e.target.parentNode.parentNode.getAttribute("url");
  const bookmarkVideoId = e.target.parentNode.parentNode.getAttribute("videoId");
  const bookmarkElementToDelete = document.getElementById(
    "bookmark-" + bookmarkVideoId
  );

  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

  chrome.tabs.sendMessage(activeTab.id, {
    type: "DELETE",
    videoURL: bookmarkUrl,
    videoId: bookmarkVideoId
  }, viewBookmarks);
};

const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
  const controlElement = document.createElement("img");

  controlElement.src = "assets/" + src + ".png";
  controlElement.title = src;
  controlElement.addEventListener("click", eventListener);
  controlParentElement.appendChild(controlElement);
};

const reset = () => {
  chrome.storage.sync.clear()
}
const resetbtn = document.getElementById("reset");
resetbtn.addEventListener("click", reset);

document.addEventListener("DOMContentLoaded", async () => {

  const activeTab = await getActiveTabURL();
  const queryParameters = activeTab.url.split("?")[1];
  const urlParameters = new URLSearchParams(queryParameters);

  const currentVideo = urlParameters.get("v");

  if (activeTab.url.includes("youtube.com")) {
    chrome.storage.sync.get(key).then((result) => {
      const currentYTBookmarks = result[key] ? result[key] : "{}";

      viewBookmarks(currentYTBookmarks);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML = '<div class="title">This is not a youtube video page.</div>';
  }

});



