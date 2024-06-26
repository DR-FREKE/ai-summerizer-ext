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
    const current_tab = tabs[0];

    const is_youtube_type = (url: string) => {
      return url.includes("youtube.com") && url.includes("/watch");
    };

    const is_type_youtube = is_youtube_type(current_tab.url!);

    console.log(is_type_youtube);

    response(is_type_youtube);
  });

  return true;
});

console.log("waa");

/** add listener to listen for if the user is signed in */
chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.type == "get_session") {
    console.log("message; ", message.type);

    // Example usage
    fetchSession().then(session => {
      // Handle the session data
      console.log("Fetched session:", session);
      response(session);
    });
    return true;
  }
});

async function fetchSession() {
  try {
    const response = await fetch("http://localhost:3000/api/auth/session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log("response is: ", response);
      const session = await response.json();
      console.log("session...:", session);
      return session;
    } else {
      throw new Error("Failed to retrieve session data");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
