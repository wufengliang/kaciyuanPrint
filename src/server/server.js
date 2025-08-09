/*
 * @Author: wufengliang 44823912@qq.com
 * @Date: 2025-08-05 17:45:50
 * @LastEditTime: 2025-08-08 17:53:12
 * @Description: 
 */
import express from 'express';
import bodyParser from 'body-parser';
import http from 'node:http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';

process.env.PORT = 19191;

export class AppServer {
    app;
    server;
    io;
    mainService;

    constructor(mainService) {
        this.mainService = mainService;
        this.app = express()
            .use(express.static('./assets'))
            .use(bodyParser.json())
            .use(cors())
        this.server = http.createServer(this.app);
        this.io = new SocketServer(this.server);
        this.app.listen(process.env.PORT, () => {
            console.log('本地服务器已启动，监听端口:' + process.env.PORT);
        })
        this.init();
    }


    init() {
        this.socketInit();
        this.expressInit();
    }

    /**
     * socket初始化
     */
    socketInit() {
        this.io?.on('connection', (socket) => {
            console.log('监听到客户端连接...');


            socket.on('message', (data) => {
                console.log('收到客户端消息:', data);
            })

            socket.on('disconnect', () => {
                console.log('客户端断开连接');
            });
        })
    }

    /**
     * express 初始化
     */
    expressInit() {
        this.app.post('/print1', async (req, res) => {
            const { width, height, leftOffset, topOffset } = req.body;
            const { html } = req.body;
            const pdf = await this.mainService.generatePdf(html, { width, height, leftOffset, topOffset })
            res.send(pdf);
        })
    }

}