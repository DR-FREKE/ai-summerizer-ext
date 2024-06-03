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
// send message to background.ts
chrome.runtime.sendMessage({ type: "youtubeOrNot" }, function (res) {
    if (!res) {
        console.log("this is not a youtube page");
    }
    /**  wait for youtube page to load complete to have access
     * to get the button that triggers the transcript if transcript is availabel*/
    setTimeout(function () {
        //use iframe to load ui
        var iframe = document.createElement("iframe");
        iframe.src = "https://app-frontend-iframe-pj8b.vercel.app"; // url where the view should load from
        iframe.style.width = "100%";
        // iframe.style.height = "125px";
        // create a div to hold the iframe and add some styling
        var summerizer_div = document.createElement("div");
        summerizer_div.style.border = "1px solid gray";
        summerizer_div.style.borderRadius = "12px";
        summerizer_div.appendChild(iframe);
        // get youtube sideview
        var yt_sidebar = document.querySelector("div[id=\"secondary\"]");
        if (yt_sidebar) {
            /** get the div where other vidoes shows up and put the extension view before it */
            var secondary_inner = document.querySelector("#secondary-inner");
            yt_sidebar.insertBefore(summerizer_div, secondary_inner);
        }
        /** listen to event from the iframe and send message back to the iframe */
        window.addEventListener("message", function (event) {
            var _a = event.data, type = _a.type, payload = _a.payload;
            if (type == "timestamp_summary") {
                chrome.runtime.sendMessage({ type: type, payload: payload }, function (res) {
                    var _a;
                    //send response back to nextjs
                    (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.postMessage({ type: "RESPONSE_ACTION", payload: res }, "*");
                });
            }
        });
    }, 3000);
});
