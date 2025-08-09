import { getChromePath } from 'chrome-launcher';
import puppeteer from 'puppeteer-core';
import dayjs from 'dayjs';
import os from 'node:os';
import path from 'node:path';

let app, browserInstance;

const pathName = os.tmpdir();

const chromePath = getChromePath();

function getHtml(html) {
    return `
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>打印窗口</title>
    <link href="http://127.0.0.1:${process.env.PORT}/css/font.css" rel="stylesheet" />
    <link href="http://127.0.0.1:${process.env.PORT}/css/hiprint.css" rel="stylesheet" />
    <link href="http://127.0.0.1:${process.env.PORT}/css/print-lock.css" rel="stylesheet" />
    <link href="http://127.0.0.1:${process.env.PORT}/css/print-lock.css" media="print" rel="stylesheet" />
    <style>
        body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
    </style>
    <script>
        window.$ = window.jQuery = require("jquery");
        $.fn.onImgLoaded = (callback) => {
            let cb = (len) => {
                if (len <= 0) {
                    callback();
                }
            };
            let len = $("img").length;
            cb(len);
            let getUrl = (str) => {
                let reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
                let v = str.match(reg);
                if (v && v.length) {
                    return v[0];
                }
                return "";
            };
            $("img").each((i, e) => {
                let $img = $(e);
                let img = new Image();
                let src = $img.attr("src");
                if (!new RegExp("[a-zA-Z]+://[^\s]*").test(src)) {
                    src = getUrl($img.attr("style") || "");
                }
                img.src = src;
                if (img.complete || src == "") {
                    len--;
                    cb(len);
                } else {
                    img.onload = () => {
                        len--;
                        cb(len);
                    };
                    img.onerror = () => {
                        len--;
                        cb(len);
                    };
                }
            });
        };
    </script>
</head>

<body>
    <div id="printElement">
${html}
    </div>
    <script>
    </script>
</body>

</html>
        `
}

export class PuppeteerService {
    constructor() {
        if (!browserInstance) {
            puppeteer.launch({
                headless: false,
                executablePath: chromePath,
            }).then(browser => {
                browserInstance = browser;
            })
        }
    }

    /**
     * 打印内容
     */
    async createPrinData(html, options = {}, isPrint = false) {
        const { width, height, topOffset, leftOffset, name = `${dayjs().toDate().getTime()}.pdf` } = options;
        const fileName = path.resolve(pathName, name);
        const page = await browserInstance.newPage();
        await page.setContent(getHtml(html));

        const pdf = await page.pdf({
            path: fileName,
            width: width ? `${width}mm` : undefined,
            height: height ? `${height}mm` : undefined,
            margin: {
                top: topOffset ? `${topOffset}mm` : undefined,
                left: leftOffset ? `${leftOffset}mm` : undefined
            }
        });
        page.close();
        return pdf;
    }

    async closeServer() {
        await browserInstance?.close();
        browserInstance = undefined;
        app = undefined;
    }
}