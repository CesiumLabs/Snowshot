// import modules
const Snowshot = require("../index");
const fs = require("fs");

// basic html code
let code = `
# H1
## H2
### H3
#### H4
##### H5
###### H6

Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
======

Alt-H2
------

Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

1. First ordered list item
2. Another item
⋅⋅* Unordered sub-list. 
1. Actual numbers don't matter, just that it's a number
⋅⋅1. Ordered sub-list
4. And another item.

⋅⋅⋅You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

⋅⋅⋅To have a line break without a paragraph, you will need to use two trailing spaces.⋅⋅
⋅⋅⋅Note that this line is separate, but within the same paragraph.⋅⋅
⋅⋅⋅(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

* Unordered list can use asterisks
- Or minuses
+ Or pluses

<style>
@import url('https://fonts.googleapis.com/css2?family=Play&display=swap');
body {
    color: white;
    background-color: black;
    font-family: 'Play', sans-serif;
}
</style>
`;

// create window
const window = new Snowshot({
    height: 1080,
    width: 1920
});

// load html
window.load(code, true);

// capture website
window.captureWebsite("https://discord.com").then((image) => {
    // save the image
    fs.writeFileSync("./webshot.png", image);
});

// create screenshot
window.capture().then((image) => {
    // save the image
    fs.writeFileSync("./image.png", image);
});