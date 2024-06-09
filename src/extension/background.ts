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

    response(is_type_youtube);
  });

  return true;
});

/** listen for event coming from the iframe when the iframe successfully loads both on
 * the youtube page and other pages that an iframe will be used
 */
chrome.runtime.onMessage.addListener(async (message, sender, response) => {
  const type_arr = ["insight", "timestamp_summary", "comments", "transcript"];
  if (type_arr.includes(message.type)) {
    const { video_id } = message.payload;

    response({ success: true, data: "" });
  }
});

/** add listener to listen for if the user is signed in */
chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.type == "get_session") {
    fetch("http://localhost:3001/api/auth/session", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to retreive session data");
        }
      })
      .then(session => {
        response(session);
      })
      .catch(error => {
        console.error(error);
      });
    return true;
  }
});

// /** utility function to make request */
// const makeRequest = async (url: string, method: MethodType, body?: any) => {
//   try {
//     const headers = {
//       Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExNTg4NTEyODU3MTIzMzk0NzQ5NyIsIm5hbWUiOiJTb2xvbW9uIE5kaWZlcmVrZSIsImVtYWlsIjoic29sb21vbm5kaTk2QGdtYWlsLmNvbSIsImlhdCI6MTcxNzc1MzczMn0.JHXv0hsRiHpn-yGdYPqylDVc_IHsbvqMEvqzfDnvvQQ`,
//     };
//     const res = await fetch(url, { method, headers });
//     if (res.ok) {
//       // return the data
//       return await res.json();
//     } else {
//       throw new Error("error occured");
//     }
//   } catch (error) {}
// };
