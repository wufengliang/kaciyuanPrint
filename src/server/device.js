/**
 * 获取当前打印机
 * @param win 当前窗口
 * @returns 打印机列表
 */
export async function getDeviceList(win) {
    const list = await win.webContents.getPrintersAsync();
    return list;
}