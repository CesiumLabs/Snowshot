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
 * Aerojs allows you to take screenshot of the given HTML/Markdown code.
 * @author Snowflake107
 */
class Aero {

    /**
     * Aerojs constructor
     * @param {Object} options Aerojs options
     * @param {Array} [options.removeTags] Tags to be removed before rendering
     * @param {Array} [options.removeAttributes] Attributes to be removed before rendering
     */
    constructor(options = { removeTags: [], removeAttributes: [] }) {
        if (!options.removeTags) options.removeTags = [];
        if (!options.removeAttributes) options.removeAttributes = [];
        if (!Array.isArray(options.removeTags)) throw new Error(`Expected "options.removeTags" type to be Array, received ${typeof options.removeTags}!`);
        if (!Array.isArray(options.removeAttributes)) throw new Error(`Expected "options.removeAttributes" type to be Array, received ${typeof options.removeAttributes}!`);
        
        /**
         * Aerojs options
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
     * Creates screenshot of loaded html
     * @param {Object} options options for puppeteer.screenshot()
     * @returns {Promise<Buffer>}
     */
    async capture(...options) {
        if (!this.rawHTML) throw new Error("No html content found, Please load HTML before using capture method!");
        const browser = await Puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(this.rawHTML);
        const buffer = await page.screenshot(...options);
        await browser.close();
        return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
    }

    /**
     * Aerojs version
     * @type {String}
     */
    static get version() {
        return require("../package.json").version
    }

}

module.exports = Aero;