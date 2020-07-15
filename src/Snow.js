const Puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const showdown = require("showdown");
let converter = new showdown.Converter({
    emoji: true,
    literalMidWordUnderscores: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    simpleLineBreaks: true
});
const fs = require("fs");

/**
 * Snowshot allows you to take screenshot of the given HTML/Markdown code.
 * @author Snowflake107
 */
class Snowshot {

    /**
     * Snowshot constructor
     * @param {Object} options Snowshot options
     * @param {Array} [options.removeTags] Tags to be removed before rendering
     * @param {Array} [options.removeAttributes] Attributes to be removed before rendering
     * @param {Number} [options.height] Window Height
     * @param {Number} [options.width] Window width
     * @param {Object} puppeteerOptions Puppeteer Options
     */
    constructor(options = { removeTags: [], removeAttributes: [], args: [], height: 800, width: 1280 }, puppeteerOptions = {}) {
        if (!options.removeTags) options.removeTags = [];
        if (!options.removeAttributes) options.removeAttributes = [];
        if (!options.height) options.height = 800;
        if (!options.width) options.width = 1280;
        if (!puppeteerOptions) puppeteerOptions = {};
        if (typeof options !== "object") throw new Error(`Expected options to be an Object, received ${typeof options}!`);
        if (!Array.isArray(options.removeTags)) throw new Error(`Expected "options.removeTags" type to be Array, received ${typeof options.removeTags}!`);
        if (!Array.isArray(options.removeAttributes)) throw new Error(`Expected "options.removeAttributes" type to be Array, received ${typeof options.removeAttributes}!`);
        if (isNaN(options.height)) throw new Error(`Expected "options.height" to be a number, received ${typeof options.height}`);
        if (isNaN(options.width)) throw new Error(`Expected "options.height" to be a number, received ${typeof options.width}`);
        if (typeof puppeteerOptions !== "object") throw new Error(`Expected putteteerOptions to be an Object, received ${typeof puppeteerOptions}!`);

        /**
         * Snowshot options
         * @type {Object}
         */
        this.options = options;

        /**
         * Puppeteer options
         * @type {Object}
         */
        this.puppeteerOptions = puppeteerOptions;
        /**
         * Raw HTML code
         * @type {String}
         */
        this.rawHTML = "";
    }

    /**
     * Loads HTML from file
     * @param {String} filePath Path to file
     * @param {Boolean} markdown Render markdown?
     */
    loadFromFile(filePath, markdown = false) {
        if (!filePath || typeof filePath !== "string") throw new Error(`File path must be a string, received ${typeof filePath}`);
        try {
            const data = fs.readFileSync(filePath, { encoding: "utf-8" });
            return this.load(data, markdown);
        } catch (e) {
            throw new Error("Invalid file or file path!");
        }
    }

    /**
     * Loads HTML from the given html or markdown input
     * @param {String} input HTML or markdown code
     * @param {Boolean} [isMarkdown=false] if the given input is a markdown, set the value to true
     * @returns {void}
     */
    load(input, isMarkdown = false) {
        if (!input || typeof input !== "string") throw new Error(`Input must be a string, received ${typeof input}`);
        let html = input;
        if (isMarkdown) {
            html = converter.makeHtml(html);
        };
        const $ = cheerio.load(html);
        $("*").each((index, element) => {
            Object.keys(element.attribs)
                .filter(attribute => this.options.removeAttributes.includes(attribute))
                .forEach((attrb) => {
                    $(element).removeAttr(attrb);
                });
        });
        this.options.removeTags.forEach(tag => {
            $(tag).remove();
        });
        this.rawHTML = $.html();
    }

    /**
     * Returns loaded HTML
     * @type {String}
     */
    getHTML() {
        console.warn("This method has been deprecated and will be removed in next update! Use html() instead.");
        return this.html();
    }

    /**
     * Returns loaded HTML
     * @type {String}
     */
    html() {
        return this.rawHTML;
    }

    /**
     * Set custom user agent
     * @param {String} userAgent User agent
     */
    setUserAgent(userAgent) {
        if (!userAgent || typeof userAgent !== "string") throw new Error("User agent must be a string.");
        /**
         * User agent
         */
        this.userAgent = userAgent;
        return;
    }

    /**
     * Creates screenshot of loaded html
     * @param {Object} options options for puppeteer.screenshot()
     * @returns {Promise<Buffer>}
     */
    capture(options) {
        console.warn("This method has been deprecated and will be removed in next update! Use screenshot() instead.");
        return this.screenshot(false, options);
    }

    /**
     * Captures website via url
     * @param {String} url Website url
     * @param {Object} options Capture options
     * @returns {Promise<Buffer>}
     */
    captureWebsite(url, options) {
        console.warn("This method has been deprecated and will be removed in next update! Use screenshot() instead.");
        return this.screenshot(url, options);
    }

    /**
     * Captures website via url
     * @param {String} url Website url. If set to false, it will try to screenshot loaded html.
     * @param {Object} options Capture options
     * @returns {Promise<Buffer>}
     */
    async screenshot(url = false, options) {
        if (options && typeof options !== "object") throw new Error("Option type must be an object");
        if (options && options["path"]) delete options["path"];
        const browser = await Puppeteer.launch(this.puppeteerOptions);
        const page = await browser.newPage();
        await page.setViewport({
            width: this.options.width,
            height: this.options.height
        });
        if (!url) {
            if (!this.rawHTML) {
                await browser.close();
                throw new Error("No html content found, Please load HTML before using screenshot method!");
            }
            await page.setContent(this.rawHTML);
            const buffer = await page.screenshot(options);
            await browser.close();
            return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
        } else {
            if (typeof url !== "string") {
                await browser.close();
                throw new Error(`URL type must be a string, received ${typeof url}`);
            }
            if (this.userAgent) await page.setUserAgent(this.userAgent);
            await page.goto(url);
            const buffer = await page.screenshot(options);
            await browser.close();
            return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
        }
    }

    /**
     * Snowshot version
     * @type {String}
     */
    static get version() {
        return require("../package.json").version
    }

}

module.exports = Snowshot;