# Snowshot
Snowshot is a simple package that allows you to take screenshot of given HTML code.

# Features
- Simple
- Fast
- Allows you to remove tags, attributes
- Supports markdown

## Preview
![img](https://i.imgur.com/eeaJ7T9.png)

# Installing

```sh
npm i --save snowshot
```

# Getting started
- Load Snowshot

  ```js
    const Snowshot = require("snowshot");
    const window = new Snowshot();
  ```

- Load HTML
  
  ```js
    window.load("<h1>Hello World</h1>");
  ```

- Take screenshot
  
  ```js
    await window.capture();
  ```

- Save as image
  
  ```js
    let data = await window.capture();
    fs.writeFileSync("./myimage.png", data);
  ```

## Basic Example

```js
const Snowshot = require("snowshot");
const window = new Snowshot();
const fs = require("fs");

window.load("<h1>Hello World</h1>");
window.capture().then(data => {
    fs.writeFileSync("./image.png", data);
});
```

## Using Markdown

```js
const Snowshot = require("snowshot");
const window = new Snowshot();
const fs = require("fs");

window.load("# Hello World", true);
window.capture().then(data => {
    fs.writeFileSync("./image.png", data);
});
```

## Using both html & markdown

```js
const Snowshot = require("snowshot");
const window = new Snowshot();
const fs = require("fs");

window.load("# Hello World<br><br><h2>Goodbye world</h2>", true);
window.capture().then(data => {
    fs.writeFileSync("./image.png", data);
});
```

## Removing script tag from the loaded code

```js
const Snowshot = require("snowshot");
const window = new Snowshot({
    removeTags: ["script"]
});
const fs = require("fs");

window.load("<script>location.href = 'https://youtube.com'</script>");
window.capture().then(data => {
    fs.writeFileSync("./image.png", data);
});
```

# API

## Snowshot({ options })
Creating a new instance of **Snowshot** allows you to load & capture screenshot.
You can create a new instance using this code:

```js
const Snowshot = require("snowshot");
const window = new Snowshot();
```
**Snowshot** accepts these options:
**`options.removeTags`**: This option allows you to remove provided tags before loading the code. Value for this option must be **Array**.
Example:

```js
new Snowshot({
    removeTags: ["script"]
});
```

**`options.removeAttributes`**: This option allows you to remove certain attributes from the code. Value for this option must be **Array**.
Example:

```js
new Snowshot({
    removeAttributes: ["onload"]
});
```

## Snowshot.load(code, markdown=false)
This method allows you to load your HTML or Markdown code. Code type must be a **String**.
First parameter takes your code and second parameter takes a **Boolean** value. If second parameter is set to `true`, it will render markdown too.
Example:

```js
const Snowshot = require("snowshot");
const window = new Snowshot();

window.load("<h1>Hello World</h1>");
```

## Snowshot.getHTML()
This method allows you to get the loaded HTML code. It might be different from the original code.
Example:

```js
const Snowshot = require("snowshot");
const window = new Snowshot();

window.load("<h1>Hello World</h1>");

console.log(window.getHTML());
```

## Snowshot.capture(options)
This method allows you to take screenshot of your code.
**options** are the options for **[Puppeteer.PageScreenshotOptions](https://github.com/puppeteer/puppeteer/blob/v5.0.0/docs/api.md#pagescreenshotoptions)**.
Example:

```js
const Snowshot = require("snowshot");
const window = new Snowshot();

window.load("<h1>Hello World</h1>");
window.capture().then(data => fs.writeFileSync(data));
```

## Snowshot.version
Current version of **Snowshot**. You may not use this after instantiating **Snowshot** class.
Example:

```js
const Snowshot = require("snowshot");
console.log(Snowshot.version);
```

# Created and maintained by
**[Snowflake107](https://github.com/Snowflake107)**

## Join my discord server
**[Snowflake Development](https://snowflakedev.xyz/discord)**