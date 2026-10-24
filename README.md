# basuru07.github.io

Personal portfolio of **Basuru Yasaruwan**, Systems Engineer.

Live: [https://basuru07.github.io/](https://basuru07.github.io/)

## Stack

Plain HTML, CSS and vanilla JavaScript. No build step, no frameworks.

- `index.html`: all page content
- `css/main.css`: styles, with light and dark themes defined as CSS variables
- `js/main.js`: theme toggle, mobile menu, active-section highlighting, scroll reveals, project filters, copy-email
- `images/`: portrait, project screenshots and article covers

## Editing content

Everything lives in `index.html`, one `<section>` per area (About, Experience, Projects, Skills, Awards, Writing, Contact).

- **New project:** copy an `<article class="project">` block and set `data-cat` to one or more of `devops web mobile ai`.
- **New article:** copy an `<a class="post card">` block in the Writing section.

## Running locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## License

MIT
