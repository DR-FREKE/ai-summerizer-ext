// import ReactDOM from "react-dom/client";

/** the content.ts is the frontend
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

let iframeInserted = false; // Add a flag to track if the iframe has been inserted

// send message to background.ts
chrome.runtime.sendMessage({ type: "youtubeOrNot" }, res => {
  // if the background does not return a positive result after the event was sent
  if (!res) {
    return;
  }

  let iframe_url = "https://app-frontend-iframe.vercel.app";
  const video_id = new URLSearchParams(window.location.search).get("v");

  /** function to create and insert the extension to the left side of youtube */
  const insertIframe = () => {
    if (iframeInserted) return; // prevents multiple load of the iframe

    //use iframe to load ui
    const iframe = document.createElement("iframe");
    iframe.src = iframe_url; // url where the view should load from
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "1px solid rgba(0, 0, 0, 0.08)";
    iframe.style.borderRadius = "12px";
    iframe.style.overflow = "hidden";
    iframe.style.display = "block";

    // create a div to hold the iframe and add some styling
    const summerizer_div = document.createElement("div");
    summerizer_div.style.transition = "transform 0.3s ease 0s, opacity 0.3s ease 0s, height 0.5s ease 0s";
    // summerizer_div.style.height = "auto";
    summerizer_div.style.marginBottom = "8px";
    summerizer_div.style.order = "-1";
    summerizer_div.appendChild(iframe);

    // get youtube sideview
    const yt_sidebar = <HTMLElement>document.querySelector(`div[id="secondary"]`);

    if (yt_sidebar) {
      yt_sidebar.insertBefore(summerizer_div, yt_sidebar.firstChild);
      iframeInserted = true;
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

    setTimeout(() => {
      chrome.runtime.sendMessage({ type: "get_session" }, session => {
        console.log("gotten session", session);
        if (!session || session == undefined || session.accessToken == undefined) {
          // set iframe url to include unauthorized
          iframe.src = iframe_url + "/unauthorized";

          // might send an event as well
          return;
        }

        // if there's session, set token as a query string in the iframe src
        iframe.src = `${iframe_url}/?token=${session.accessToken}`;
      });
    }, 3000);

    /** listen to event from the tabs from the iframe and send message back to the iframe */
    window.addEventListener("message", async event => {
      const { type, payload } = event.data;
      const regex_match = /^(insights|timestamp_summary|comments|transcript)$/;

      if (regex_match.test(type)) {
        //send response back to nextjs
        iframe.contentWindow?.postMessage({ type: "TAB_RESPONSE", payload: { url: "/transcript", video_id, type } }, "*");
      }
    });

    /** listen for dropdown event to adjust the height of the iframe */
    window.addEventListener("message", async event => {
      const { type, height } = event.data;

      if (type == "HEIGHT_OPEN" && height) {
        iframe.style.height = `${height}px`;
      }

      if (type === "HEIGHT_CLOSED") {
        iframe.style.height = `auto`;
      }
    });

    /** listen for signin event from the iframe, process and send message back */
    // window.addEventListener('message', async event => {
    //   chrome.runtime.sendMessage({createNewTab:true, url:""})
    // })
  };

  // create a mutation observer to observe changes in the DOM
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      // check if the mutation type is a childlist so we can put the iframe there
      if (mutation.type == "childList") {
        // get youtube sideview
        const yt_sidebar = <HTMLElement>document.querySelector(`div[id="secondary"]`);
        if (yt_sidebar && !iframeInserted) {
          observer.disconnect(); // stop observing once the sidebar is loaded
          insertIframe(); // insert the iframe when the sidebar is loaded
        }
      }
    }
  });

  // start observing the body for childlist change
  observer.observe(document.body, { childList: true, subtree: true });
});
