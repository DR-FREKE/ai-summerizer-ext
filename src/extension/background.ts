/**
 *
 * background.ts has access to the browser doms
 */

// listen to message from content.ts to check if current page is a youtube page
chrome.runtime.onMessage.addListener((message, sender, response) => {
  if (message.type !== "youtubeOrNot") {
    // return some weird response
    return;
  }

  // continue
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const current_tab = tabs[0];

    const is_youtube_type = (url: string) => {
      return url.includes("youtube.com") && url.includes("/watch");
    };

    const is_type_youtube = is_youtube_type(current_tab.url!);

    response(is_type_youtube);
  });

  return true;
});
