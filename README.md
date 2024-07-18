# Chrome Extension Setup Guide

To test or run the Chrome extension, follow these steps:

1. Go to the URL `chrome://extensions`.
2. Enable Developer mode by toggling the switch in the top right corner.
3. Click on "Load unpacked" which will open your file explorer. Select the extension folder, specifically the `/dist` folder.
4. After successfully unpacking the `dist` folder of the extension, start the extension by navigating to the extension folder in your terminal and running:

   ```bash
   npm run watch:all
   ```

Once that's done, go back to chrome://extensions and refresh the extension.

With this done, you can go to a YouTube video page, and the extension will be loaded.
