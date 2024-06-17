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

enum MethodType {
  Get = "GET",
  Post = "POST",
}

// send message to background.ts
chrome.runtime.sendMessage({ type: "youtubeOrNot" }, res => {
  if (!res) {
    return;
  }

  let iframe_url = "https://app-frontend-iframe-pj8b.vercel.app";
  const video_id = new URLSearchParams(window.location.search).get("v");

  /**  wait for youtube page to load complete to have access
   * to get the sideview*/
  setTimeout(() => {
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
    summerizer_div.style.height = "auto";
    summerizer_div.style.marginBottom = "8px";
    summerizer_div.style.order = "-1";
    summerizer_div.appendChild(iframe);

    // get youtube sideview
    const yt_sidebar = <HTMLElement>document.querySelector(`div[id="secondary"]`);

    if (yt_sidebar) {
      yt_sidebar.insertBefore(summerizer_div, yt_sidebar.firstChild);
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
      if (!session || session == undefined || session.accessToken == undefined) {
        // set iframe url to include unauthorized
        iframe.src = iframe_url + "/unauthorized";

        // might send an event as well
      }

      // if there's session, set token as a query string in the iframe src
      iframe.src = `${iframe_url}/?token=${session.accessToken}`;
    });

    /** listen to event from the tabs from the iframe and send message back to the iframe */
    window.addEventListener("message", async event => {
      const { type, payload } = event.data;
      const regex_match = /^(insight|timestamp_summary|comments|transcript)$/;

      if (regex_match.test(type)) {
        //send response back to nextjs
        iframe.contentWindow?.postMessage({ type: "RESPONSE_ACTION", payload: { video_id, type } }, "*");
      }
    });
  }, 3000);
});

/** utility function to make request */
const makeRequest = async (url: string, method: string, body?: any) => {
  const headers = {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExNTg4NTEyODU3MTIzMzk0NzQ5NyIsIm5hbWUiOiJTb2xvbW9uIE5kaWZlcmVrZSIsImVtYWlsIjoic29sb21vbm5kaTk2QGdtYWlsLmNvbSIsImlhdCI6MTcxNzc1MzczMn0.JHXv0hsRiHpn-yGdYPqylDVc_IHsbvqMEvqzfDnvvQQ`,
    "Content-Type": "application/json",
  };
  const res = await fetch(url, { method, headers });
  if (res.ok) {
    // return the data
    return await res.json();
  } else {
    const errorDetails = await res.text();
    console.error(`Error: ${res.status} ${res.statusText}: ${errorDetails}`);
    throw new Error(`Request failed with status ${res.status}`);
  }
};
