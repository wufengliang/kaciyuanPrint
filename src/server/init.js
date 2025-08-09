/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2025-08-08 09:58:07
 * @LastEditTime: 2025-08-08 18:01:27
 * @Description: 
 */
import { getDeviceList } from './device';
import { PuppeteerService } from './puppeteer';
import { AppServer } from './server';

export class InitService {
    mainWin;
    deviceList = [];

    appServer;
    puppeteerService;

    constructor(win) {
        this.mainWin = win;
        this.init();
    }

    async init() {
        this.deviceList = await getDeviceList(this.mainWin);
        console.log('获取打印机列表', this.deviceList);
        this.appServer = new AppServer(this);
        this.puppeteerService = new PuppeteerService();
    }

    /**
     * 生成pdf
     */
    async generatePdf(html, options,isPrint) {
        const pdf = await this.puppeteerService.createPrinData(html, options);
        return pdf;
    }
}