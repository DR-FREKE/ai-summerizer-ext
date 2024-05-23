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
chrome.runtime.sendMessage({ type: "youtubeOrNot" }, (res) => {
  if (!res) {
    console.log("this is not a youtube page");
  }

  // else proceed
  console.log("This is a YouTube Page!!!");
});
