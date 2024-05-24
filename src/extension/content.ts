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

  /**  wait for youtube page to load complete to have access
   * to get the button that triggers the transcript if transcript is availabel*/
  setTimeout(() => {
    // transcript button
    const transcript_btn = <HTMLButtonElement>(
      document.querySelector('button[aria-label="Show transcript"]')
    );

    transcript_btn?.click();
    const content_wrapper = <HTMLElement>(
      document.querySelector(
        '<ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]'
      )
    );

    if (content_wrapper) {
      let transcript = [];
      content_wrapper.style.opacity = "0";

      // collect each transcript with an id called "content"
    }
  }, 3000);
});
