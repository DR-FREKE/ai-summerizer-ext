/**
 *
 * background.ts has access to the browser doms
 */
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
// import axios from "axios";
// listen to message from content.ts to check if current page is a youtube page
chrome.runtime.onMessage.addListener(function (message, sender, response) {
    if (message.type !== "youtubeOrNot") {
        // return some weird response
        return;
    }
    // continue
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length === 0) {
            // Handle case where no active tab is found
            response(false);
            return;
        }
        var current_tab = tabs[0];
        var is_youtube_type = function (url) {
            return url.includes("youtube.com") && url.includes("/watch");
        };
        var is_type_youtube = is_youtube_type(current_tab.url);
        console.log("is youtube", is_type_youtube);
        response(is_type_youtube);
    });
    return true;
});
/** add listener to listen for if the user is signed in */
chrome.runtime.onMessage.addListener(function (message, sender, response) {
    if (message.type == "get_session") {
        // Example usage
        fetchData("http://localhost:3000/api/auth/session").then(function (session) {
            // Handle the session data
            console.log("Fetched session:", session);
            response(session);
        });
        return true;
    }
});
/** add listener to validate if current video playing is in our DB so to enable auto summary */
chrome.runtime.onMessage.addListener(function (message, sender, response) {
    // listen for message "video_exist"
    if (message.type == "video_exist") {
        // make request to check if that video exists in out db
        fetchData("http://localhost:3000/api/video/".concat(message.payload)).then(function (video_info) {
            console.log("fetched data", video_info);
            response(video_info);
        });
        return true;
    }
});
chrome.runtime.onMessage.addListener(function (message, sender, response) {
    var _a;
    if (message.createNewTab && ((_a = sender.tab) === null || _a === void 0 ? void 0 : _a.id)) {
        alert("wassa");
        chrome.tabs.update(sender.tab.id, { url: message.url });
    }
});
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, fetch(url, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("the error", error_1);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
