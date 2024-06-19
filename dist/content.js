// import ReactDOM from "react-dom/client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
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
        return;
    }
    var iframe_url = "https://app-frontend-iframe-pj8b.vercel.app";
    var video_id = new URLSearchParams(window.location.search).get("v");
    /**  wait for youtube page to load complete to have access
     * to get the sideview*/
    setTimeout(function () {
        //use iframe to load ui
        var iframe = document.createElement("iframe");
        iframe.src = iframe_url; // url where the view should load from
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "1px solid rgba(0, 0, 0, 0.08)";
        iframe.style.borderRadius = "12px";
        iframe.style.overflow = "hidden";
        iframe.style.display = "block";
        // create a div to hold the iframe and add some styling
        var summerizer_div = document.createElement("div");
        summerizer_div.style.transition = "transform 0.3s ease 0s, opacity 0.3s ease 0s, height 0.5s ease 0s";
        summerizer_div.style.height = "auto";
        summerizer_div.style.marginBottom = "8px";
        summerizer_div.style.order = "-1";
        summerizer_div.appendChild(iframe);
        // get youtube sideview
        var yt_sidebar = document.querySelector("div[id=\"secondary\"]");
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
        chrome.runtime.sendMessage({ type: "get_session" }, function (session) {
            if (!session || session == undefined || session.accessToken == undefined) {
                // set iframe url to include unauthorized
                iframe.src = iframe_url + "/unauthorized";
                // might send an event as well
            }
            // if there's session, set token as a query string in the iframe src
            iframe.src = "".concat(iframe_url, "/?token=").concat(session.accessToken);
        });
        /** listen to event from the tabs from the iframe and send message back to the iframe */
        window.addEventListener("message", function (event) { return __awaiter(_this, void 0, void 0, function () {
            var _a, type, payload, regex_match;
            var _b;
            return __generator(this, function (_c) {
                _a = event.data, type = _a.type, payload = _a.payload;
                regex_match = /^(insight|timestamp_summary|comments|transcript)$/;
                if (regex_match.test(type)) {
                    //send response back to nextjs
                    (_b = iframe.contentWindow) === null || _b === void 0 ? void 0 : _b.postMessage({ type: "RESPONSE_ACTION", payload: { url: "/transcript", video_id: video_id, type: type } }, "*");
                }
                return [2 /*return*/];
            });
        }); });
        /** listen for signin event from the iframe, process and send message back */
        // window.addEventListener('message', async event => {
        //   chrome.runtime.sendMessage({createNewTab:true, url:""})
        // })
    }, 3000);
});
