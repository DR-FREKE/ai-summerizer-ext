/**
 * the content.ts is the frontend
 *
 * we first need to identify if the current page we are on is a youtube page...we do this
 * by creating a connection with the background.ts and send a message to the background.ts
 * ...in the background.ts, we're checking if we're inside a youtube page or not then sending a message
 * back to the content.ts
 *
 * ***
 *
 * NOTE: find out if the extension is supposed to work for only youtube video
 * and no possibility of other type of videos
 */

let iframe: HTMLIFrameElement;
let currentVideoId: string | null = null;
let listenersAdded = false; // Flag to ensure listeners are added only once

// function to get the current YouTube video ID
const getCurrentVideoId = () => new URLSearchParams(window.location.search).get("v");

const insertIframe = () => {
  console.log("YouTube video page detected!!!");

  const video_id = getCurrentVideoId();
  if (!video_id) {
    console.log("No video ID found, aborting iframe insertion.");
    return;
  }

  console.log("Creating iframe...", video_id);

  let iframe_url = "https://app-frontend-iframe.vercel.app";

  // Create iframe element
  iframe = document.createElement("iframe");
  iframe.src = iframe_url;
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.border = "1px solid rgba(0, 0, 0, 0.08)";
  iframe.style.borderRadius = "12px";
  iframe.style.overflow = "hidden";
  iframe.style.display = "block";
  iframe.allow = "clipboard-read; clipboard-write";

  // create a div to hold the iframe and add some styling
  const summerizer_div = document.createElement("div");
  summerizer_div.classList.add("extension-iframe-container");
  summerizer_div.style.transition = "transform 0.3s ease 0s, opacity 0.3s ease 0s, height 0.5s ease 0s";
  summerizer_div.style.height = "auto";
  summerizer_div.style.marginBottom = "8px";
  summerizer_div.style.order = "-1";
  summerizer_div.appendChild(iframe);

  // get youtube sideview
  const yt_sidebar = document.querySelector<HTMLElement>('div[id="secondary"]');

  if (yt_sidebar && !yt_sidebar.querySelector(".extension-iframe-container")) {
    yt_sidebar.insertBefore(summerizer_div, yt_sidebar.firstChild);
    console.log("Iframe inserted for video ID:", video_id);
  } else {
    console.log("Failed to find YouTube sidebar or iframe already exists.");
  }

  /** get the user session...users most authenticate with google login before they can use the extension
   *
   *
   * NOTE: if they sign in and use the extension, the content should be store in a state management library
   * like redux on the component the iframe loads...only show few items from the store if there's no more session
   * but there's content in the store else show a different ui.
   *
   *
   */

  chrome.runtime.sendMessage({ type: "get_session" }, session => {
    console.log("gotten sessions", session);
    if (!session) {
      // set iframe url to include unauthorized
      iframe.src = iframe_url + "/unauthorized";
      // might send an event as well
      return;
    }
    // if there's session, set token as a query string in the iframe src
    iframe.src = `${iframe_url}/?token=${session.accessToken}`;
  });

  if (!listenersAdded) {
    window.addEventListener("message", event => {
      const { type, payload } = event.data;
      if (type == "GET_VIDEO_ID" && video_id == currentVideoId) {
        console.log("THIS IS GET_VIDEO MESSAGE!!!", currentVideoId);
        chrome.runtime.sendMessage({ type: "video_exist", payload: video_id }, video_info => {
          // handle the response if needed
          console.log("is video available for", currentVideoId);

          if (video_info.data && video_info != undefined) {
            console.log("is video available", video_info.data);
            // send response to the nextjs frontend
            iframe.contentWindow?.postMessage({ type: "LOAD_RESPONSE", payload: { url: "/transcript", video_id: currentVideoId } }, "*");
          }
        });
      }
    });

    // /** listen to event from the tabs from the iframe and send message back to the iframe */
    window.addEventListener("message", async event => {
      const { type, payload } = event.data;
      const regex_match = /^(insights|timestamp_summary|comments|transcript)$/;

      console.log("tab pressed");

      if (regex_match.test(type)) {
        //send response back to nextjs
        iframe.contentWindow?.postMessage({ type: "TAB_RESPONSE", payload: { url: "/transcript", video_id, type } }, "*");
      }
    });

    window.addEventListener("message", event => {
      const { type, payload } = event.data;
      if (type == "GO_TO_SIGNIN") {
        // get full youtube url to send back to iframe
        const currentUrl = window.location.href;
        iframe.contentWindow?.postMessage({ type: "SIGN_IN", payload: { url: currentUrl } }, "*");
      }
    });

    window.addEventListener("message", event => {
      const { type, height } = event.data;
      const height_options = {
        HEIGHT_OPEN: `${height}px`,
        OPEN_CONTENT_BODY: `${height}px`,
        CLOSE_CONTENT_BODY: `${height}px`,
        HEIGHT_CLOSED: `${height}px`,
        OPEN_LOGIN_BODY: `${height}px`,
      };

      console.log("this is the type and the height", type, height);

      iframe.style.height = height_options[type as keyof typeof height_options];

      // if (type == "HEIGHT_OPEN" && height) {
      //   iframe.style.height = `${height}px`;
      // }

      // if (type == "OPEN_CONTENT_BODY" && height) {
      //   iframe.style.height = `${height}px`;
      // }

      // if (type === "HEIGHT_CLOSED") {
      //   iframe.style.height = `auto`;
      // }

      // if (type === "CLOSE_CONTENT_BODY") {
      //   iframe.style.height = "auto";
      // }
    });

    listenersAdded = true;
  }
};

const removeIframe = () => {
  const summerizer_div = document.querySelector<HTMLElement>(".extension-iframe-container");
  if (summerizer_div && summerizer_div.parentNode) {
    summerizer_div.parentNode.removeChild(summerizer_div);
    // iframe = null;

    console.log("Iframe removed");
  }
};

const checkAndInject = () => {
  chrome.runtime.sendMessage({ type: "youtubeOrNot" }, res => {
    if (!res) {
      removeIframe();
      return;
    }

    const video_id = getCurrentVideoId();
    console.log("Current video ID:", video_id, "Previous video ID:", currentVideoId);

    if (video_id && video_id !== currentVideoId) {
      currentVideoId = video_id;
      removeIframe();
      setTimeout(insertIframe, 7000);
    } else if (!video_id && iframe) {
      removeIframe();
    }
  });
};

const handleNavigation = () => {
  window.addEventListener("yt-navigate-finish", checkAndInject);

  // Fallback for manual URL changes (in case `yt-navigate-finish` doesn't fire)
  let lastUrl = window.location.href;
  new MutationObserver(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      checkAndInject();
    }
  }).observe(document, { subtree: true, childList: true });
};

// Initial check and handling
checkAndInject();
handleNavigation();

// Additional event listener to ensure check after page load and navigation
window.addEventListener("load", checkAndInject);
