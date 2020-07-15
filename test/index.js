// import modules
const Snowshot = require("../index");
const fs = require("fs");

// create window
const browser = new Snowshot({
    height: 1080,
    width: 1920
});

// load html
browser.loadFromFile("./test.html");

// create screenshot
browser.screenshot().then((image) => {
    // save the image
    fs.writeFileSync("./image.png", image);
});