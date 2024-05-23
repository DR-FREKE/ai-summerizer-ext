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
