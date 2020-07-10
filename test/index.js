// import modules
const Aero = require("../index");
const fs = require("fs");

// basic html code
let code = `<style>
body {
    background-color: black;
    color: white;
}
</style>
# Aerojs
Aerojs is a simple package that allows you to take screenshot of given HTML code.

# Features
- Simple
- Fast
- Allows you to remove tags, attributes
- Supports markdown

# Installing

\`\`\`sh
npm i --save aerojs
\`\`\`

# Getting started
- Load Aerojs

\`\`\`js
const Aerojs = require("aerojs");
const aero = new Aerojs();
\`\`\`

- Load HTML

\`\`\`js
aero.load("<h1>Hello World</h1>");
\`\`\`

- Take screenshot
  
\`\`\`js
await aero.capture();
\`\`\`

- Save as image
  
\`\`\`js
let data = await aero.capture();
fs.writeFileSync("./myimage.png", data);
\`\`\`

## Basic Example

\`\`\`js
const Aerojs = require("aerojs");
const aero = new Aerojs();
const fs = require("fs");

aero.load("<h1>Hello World</h1>");
aero.capture().then(data => {
    fs.writeFileSync("./image.png", data);
});
\`\`\`

## Using Markdown

\`\`\`js
const Aerojs = require("aerojs");
const aero = new Aerojs();
const fs = require("fs");

aero.load("# Hello World", true);
aero.capture().then(data => {
    fs.writeFileSync("./image.png", data);
});
\`\`\`

## Using both html & markdown

\`\`\`js
const Aerojs = require("aerojs");
const aero = new Aerojs();
const fs = require("fs");

aero.load("# Hello World<br><br><h2>Goodbye world</h2>", true);
aero.capture().then(data => {
    fs.writeFileSync("./image.png", data);
});
\`\`\`

## Removing script tag from the loaded code

\`\`\`js
const Aerojs = require("aerojs");
const aero = new Aerojs({
    removeTags: ["script"]
});
const fs = require("fs");

aero.load("<script>location.href = 'https://youtube.com'</script>");
aero.capture().then(data => {
    fs.writeFileSync("./image.png", data);
});
\`\`\`

# API

## Aero({ options })
Creating a new instance of **Aero** allows you to load & capture screenshot.
You can create a new instance using this code:

\`\`\`js
const Aero = require("aerojs");
const aero = new Aero();
\`\`\`

**Aero** accepts these options:
**\`options.removeTags\`**: This option allows you to remove provided tags before loading the code. Value for this option must be **Array**.
Example:

\`\`\`js
new Aero({
    removeTags: ["script"]
});
\`\`\`

**\`options.removeAttributes\`**: This option allows you to remove certain attributes from the code. Value for this option must be **Array**.
Example:

\`\`\`js
new Aero({
    removeAttributes: ["onload"]
});
\`\`\`

## Aero.load(code, markdown=false)
This method allows you to load your HTML or Markdown code. Code type must be a **String**.
First parameter takes your code and second parameter takes a **Boolean** value. If second parameter is set to \`true\`, it will render markdown too.
Example:

\`\`\`js
const Aerojs = require("aerojs");
const aero = new Aerojs();

aero.load("<h1>Hello World</h1>");
\`\`\`

## Aero.getHTML()
This method allows you to get the loaded HTML code. It might be different from the original code.
Example:

\`\`\`js
const Aerojs = require("aerojs");
const aero = new Aerojs();

aero.load("<h1>Hello World</h1>");

console.log(aero.getHTML());
\`\`\`

## Aero.capture(options)
This method allows you to take screenshot of your code.
**options** are the options for **[Puppeteer.PageScreenshotOptions](https://github.com/puppeteer/puppeteer/blob/v5.0.0/docs/api.md#pagescreenshotoptions)**.
Example:

\`\`\`js
const Aerojs = require("aerojs");
const aero = new Aerojs();

aero.load("<h1>Hello World</h1>");
aero.capture().then(data => fs.writeFileSync(data));
\`\`\`

## Aero.version
Current version of **Aerojs**. You may not use this after instantiating **Aerojs** class.
Example:

\`\`\`js
const Aerojs = require("aerojs");
console.log(Aerojs.version);
\`\`\`

# Created and maintained by
**[Snowflake107](https://github.com/Snowflake107)**

## Join my discord server
**[Snowflake Development](https://snowflakedev.xyz/discord)**`;

// create window
const window = new Aero();

// load html
window.load(code, true);

// create screenshot
window.capture().then((image) => {
    // save the image
    fs.writeFileSync("./image.png", image);
});