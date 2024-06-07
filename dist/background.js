/**
 *
 * background.ts has access to the browser doms
 */
// listen to message from content.ts to check if current page is a youtube page
chrome.runtime.onMessage.addListener(function (message, sender, response) {
    if (message.type !== "youtubeOrNot") {
        // return some weird response
        return;
    }
    // continue
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var current_tab = tabs[0];
        var is_youtube_type = function (url) {
            return url.includes("youtube.com") && url.includes("/watch");
        };
        var is_type_youtube = is_youtube_type(current_tab.url);
        response(is_type_youtube);
    });
    return true;
});
/** listen for event coming from the iframe when the iframe successfully loads both on
 * the youtube page and other pages that an iframe will be used
 */
chrome.runtime.onMessage.addListener(function (message, sender, response) {
    var type_arr = ["insight", "timestamp_summary", "comments", "cc"];
    if (type_arr.includes(message.type)) {
        response({ success: true, data: "plenty data from api" });
    }
});
/** add listener to listen for if the user is signed in */
chrome.runtime.onMessage.addListener(function (message, sender, response) {
    if (message.type == "get_session") {
        fetch("http://localhost:3000/api/auth/session", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error("Failed to retreive session data");
            }
        })
            .then(function (session) {
            response(session);
        })
            .catch(function (error) {
            console.error(error);
        });
        return true;
    }
});
