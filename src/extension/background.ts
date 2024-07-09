/**
 *
 * background.ts has access to the browser doms
 */

// import axios from "axios";

// listen to message from content.ts to check if current page is a youtube page
chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.type !== "youtubeOrNot") {
    // return some weird response
    return;
  }

  // continue
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs.length === 0) {
      // Handle case where no active tab is found
      response(false);
      return;
    }
    const current_tab = tabs[0];

    const is_youtube_type = (url: string) => {
      return url.includes("youtube.com") && url.includes("/watch");
    };

    const is_type_youtube = is_youtube_type(current_tab.url!);

    console.log("is youtube", is_type_youtube);

    response(is_type_youtube);
  });

  return true;
});

/** add listener to listen for if the user is signed in */
chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.type == "get_session") {
    // Example usage
    fetchData("http://localhost:3000/api/auth/session").then(session => {
      // Handle the session data
      console.log("Fetched session:", session);
      response(session);
    });
    return true;
  }
});

/** add listener to validate if current video playing is in our DB so to enable auto summary */
chrome.runtime.onMessage.addListener((message, sender, response) => {
  // listen for message "video_exist"
  if (message.type == "video_exist") {
    // make request to check if that video exists in out db
    fetchData(`http://localhost:3000/api/video/${message.payload}`).then(video_info => {
      console.log("fetched data", video_info);
      response(video_info);
    });

    return true;
  }
});

chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.createNewTab && sender.tab?.id) {
    alert("wassa");
    chrome.tabs.update(sender.tab.id, { url: message.url });
  }
});

async function fetchData(url: string) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // throw new Error("Failed to retrieve session data");
    }
  } catch (error) {
    console.error("the error", error);
    return null;
  }
}
