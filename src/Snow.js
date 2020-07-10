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
     * @param {Array} [options.args] Puppeteer args
     * @param {Number} [options.height] Window Height
     * @param {Number} [options.width] Window width
     */
    constructor(options = { removeTags: [], removeAttributes: [], args: [], height: 800, width: 1280 }) {
        if (!options.removeTags) options.removeTags = [];
        if (!options.removeAttributes) options.removeAttributes = [];
        if (!options.args) options.args = [];
        if (!options.height) options.height = 800;
        if (!options.width) options.width = 1280;
        if (!Array.isArray(options.removeTags)) throw new Error(`Expected "options.removeTags" type to be Array, received ${typeof options.removeTags}!`);
        if (!Array.isArray(options.removeAttributes)) throw new Error(`Expected "options.removeAttributes" type to be Array, received ${typeof options.removeAttributes}!`);
        if (!Array.isArray(options.args)) throw new Error(`Expected "options.args" type to be Array, received ${typeof options.args}!`);
        if (isNaN(options.height)) throw new Error(`Expected "options.height" to be a number, received ${typeof options.height}`);
        if (isNaN(options.width)) throw new Error(`Expected "options.height" to be a number, received ${typeof options.width}`);

        /**
         * Snowshot options
         * @type {Object}
         */
        this.options = options;

        /**
         * Raw HTML code
         * @type {String}
         */
        this.rawHTML = "";
    }

    /**
     * Loads HTML from the given html or markdown input
     * @param {String} input HTML or markdown code
     * @param {Boolean} [isMarkdown=false] if the given input is a markdown, set the value to true
     * @returns {void}
     */
    load(input, isMarkdown=false) {
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
        return this.rawHTML;
    }

    /**
     * Returns loaded HTML
     * @type {String}
     */
    html() {
        return this.getHTML();
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
    async capture(options) {
        if (!this.rawHTML) throw new Error("No html content found, Please load HTML before using capture method!");
        if (options && typeof options === "object" && options["path"]) delete options["path"];
        const browser = await Puppeteer.launch({
            args: this.options.args
        });
        const page = await browser.newPage();
        if (this.userAgent) await page.setUserAgent(this.userAgent);
        await page.setViewport({
            width: this.options.width,
            height: this.options.height
        });
        await page.setContent(this.rawHTML);
        const buffer = await page.screenshot(options);
        await browser.close();
        return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
    }

    /**
     * Captures website via url
     * @param {String} url Website url
     * @param {Object} options Capture options
     * @returns {Promise<Buffer>}
     */
    async captureWebsite(url, options) {
        if (!url) throw new Error("No url was provided!");
        if (options && typeof options === "object" && options["path"]) delete options["path"];
        const browser = await Puppeteer.launch({
            args: this.options.args
        });
        const page = await browser.newPage();
        if (this.userAgent) await page.setUserAgent(this.userAgent);
        await page.setViewport({
            width: this.options.width,
            height: this.options.height
        });
        await page.goto(url);
        const buffer = await page.screenshot(options);
        await browser.close();
        return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
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