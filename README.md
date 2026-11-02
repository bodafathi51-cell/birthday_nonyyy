# 💌 Romantic Birthday Website

A dreamy, interactive birthday gift: opening surprise → typed greeting → photo gallery →
clickable envelope with a handwritten letter → make-a-wish candle → replay.
Plain HTML + CSS + JavaScript. **No installs, no server, no accounts.**

## 📁 What's inside

```
birthday-website/
├── index.html              ← the page (you don't need to edit it)
├── src/data/content.js     ← ✏️ THE ONLY FILE YOU EDIT (name, letter, captions, music…)
├── assets/
│   ├── photos/             ← 📸 put your photos here (photo1.jpg … )
│   └── music/              ← 🎵 put song.mp3 here (optional)
├── css/style.css           ← design (no need to touch)
└── js/main.js              ← animations (no need to touch)
```

## ▶️ Run it on Windows (30 seconds)

1. Unzip the folder (right-click → **Extract All…**).
2. Open the folder and **double-click `index.html`**. It opens in your browser. That's it!

> The fonts (Dancing Script, Poppins, Caveat + Arabic: Aref Ruqaa, Cairo, Playpen Sans Arabic) load from Google Fonts, so you need internet
> to see them. Offline, the site still works and uses your computer's fonts instead.

## ✏️ Change the name and the letter

1. Right-click `src/data/content.js` → **Open with → Notepad** (or VS Code).
2. Change `recipientName: "Her Name"` to her name. It's inserted everywhere automatically.
3. Find `message: \`...\`` and write your letter between the two backticks (`` ` ``).
   - **Blank line = new paragraph.** A normal Enter = line break. Any length works; the letter scrolls.
   - Don't type a backtick (`` ` ``) inside the message.
4. Change `signature`, `date`, `specialDate`, the titles and captions the same way.
5. **Save** (Ctrl+S) and press **F5** in the browser.

Tip: `{name}` anywhere in the text becomes her name, e.g. `"Dear {name},"`.
Writing in Arabic? It works anywhere: direction and fonts switch automatically. Arabic fonts are set at the top of `css/style.css` (`--font-body`, `--font-script`, `--font-hand`); change the 2nd name in each line to try another one.

## 📸 Add your own photos

1. Copy your pictures into `assets/photos/`.
2. In `src/data/content.js`, list them under `gallery → photos`:
   ```js
   { src: "assets/photos/us-at-the-beach.jpg", caption: "Our first trip" },
   ```
3. **Add a photo** = copy one line, change the filename. **Remove a photo** = delete its line.
4. Any shape or size works: portrait, landscape, square. Nothing is stretched or cropped.

The six pink `photo1.jpg … photo6.jpg` files in that folder are **placeholders**. Replace them
with your own pictures using the same filenames, or point the list at your new filenames.
Use `.jpg`, `.jpeg`, `.png` or `.webp`. Keep each photo under ~1 MB so it loads fast
(phone photos are often 3–6 MB; shrink them free at squoosh.app).
If a filename is wrong, a friendly "Photo not found" card shows its name instead of a broken image.

## 🎵 Add music (optional)

Put an MP3 in `assets/music/` and name it `song.mp3` (or change `music.file` in `content.js`).
Music starts only after she taps "Open Your Surprise", and a ♪ button lets her mute it.
No file? The button just stays hidden and everything else works.

## 🧪 Test it

- Click through every step: surprise button → greeting → photos → envelope → letter → candle → Replay.
- Press **F12 → device icon** in Chrome/Edge to preview phone sizes.
- In `content.js`, paste a very long message to confirm the letter scrolls.
- Esc closes the letter or a photo. All buttons work with the keyboard too.

## 🌍 Publish it online for free

Easiest, with no account: **Netlify Drop**
1. Go to <https://app.netlify.com/drop>.
2. Drag the whole `birthday-website` folder onto the page.
3. You get a link like `https://random-name.netlify.app`. Send it to her. 💕
   (Make a free account to rename the link.)

Other free options: **GitHub Pages** (upload the folder to a repo → Settings → Pages) or **Cloudflare Pages**.
Tip: set a good file name before publishing; anyone with the link can see the page and your letter.

## ♿ Notes

- Respects the "reduce motion" setting on phones and computers: animations are replaced by instant reveals.
- Keyboard accessible; the letter and photo viewer trap focus and close with Esc.
