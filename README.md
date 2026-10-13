# Kavi Chellow's Birthday Surprise

A small, static birthday website made with plain HTML, CSS, and JavaScript. It needs no installation, account, build step, or external image/font service.

## Preview the website

1. Open this project folder in VS Code.
2. Double-click **`index.html`** in File Explorer to open it in your browser. You can also right-click the file in VS Code and choose **Reveal in File Explorer**, then double-click it.
3. Use the page buttons to visit the birthday greeting, memories, letter, and wishes.

The welcome page's **Open Your Surprise** button opens `birthday.html`. The optional gentle tune is generated in the browser and only plays after pressing its play button; it does not autoplay.

## Add your own photos and videos

On `memories.html`, use **Choose photos** and **Choose a video** to preview files from your device. Those previews are temporary and are not uploaded or saved by the website.

To include media permanently when you publish the website:

1. Create a folder named `media` next to `index.html`.
2. Copy your own files into it, for example `media/school-memory.jpg` and `media/friends-video.mp4`.
3. In `memories.html`, replace a photo placeholder `<div class="media-placeholder">...</div>` with an image like:

   ```html
   <img class="gallery-image" src="media/school-memory.jpg" alt="A favourite school memory">
   ```

4. Replace the video placeholder `<div class="video-placeholder" ...>...</div>` with:

   ```html
   <video class="video-preview" controls preload="metadata">
     <source src="media/friends-video.mp4" type="video/mp4">
     Your browser does not support video playback.
   </video>
   ```

Use relative paths as shown, keep filenames simple, and use media you have permission to share. Large video files can make the site slow to load.

## Publish free with GitHub Pages

1. Sign in to GitHub and create a new public repository for the site.
2. Add the files in this folder (and your `media` folder, if you added one) to the repository. Make sure `index.html` is at the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then save.
6. Wait for GitHub Pages to publish. The Pages settings screen will show the website URL. Open that URL to view the site.

GitHub Pages hosting is free for public repositories. You can update the site later by adding or editing files in the repository.

## Files

- `index.html` — welcome page and surprise-opening button
- `birthday.html` — birthday greeting, confetti, and optional music
- `memories.html` — friendship story and photo/video preview areas
- `letter.html` — the full birthday letter
- `dreams.html` — MT-15 wishes and final birthday message
- `styles.css` — shared responsive design
- `script.js` — confetti, optional music, and temporary local media previews
