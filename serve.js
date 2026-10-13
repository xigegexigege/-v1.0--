/* 汰换模拟 · 手机预览本地服务器
 * 用法：node serve.js [端口]
 * 电脑与手机连接同一 Wi-Fi 后，手机浏览器访问下面打印的地址即可。
 */
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const ROOT = __dirname;
const PORT = Number(process.argv[2]) || 8899;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".txt": "text/plain; charset=utf-8",
  ".cur": "image/x-icon",
};

function lanAddresses() {
  const nets = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) ips.push(net.address);
    }
  }
  return ips;
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent((req.url || "/").split("?")[0]);
  } catch (e) {
    res.writeHead(400).end("Bad Request");
    return;
  }
  if (pathname === "/") pathname = "/index.html";

  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found: " + pathname);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("  ==================================================");
  console.log("   汰换模拟 v1.0 · 手机预览已启动");
  console.log("  ==================================================");
  console.log("");
  console.log("   本机预览:  http://localhost:" + PORT + "/");
  const ips = lanAddresses();
  if (ips.length) {
    console.log("");
    console.log("   手机访问（需同一 Wi-Fi，任选其一）:");
    ips.forEach((ip) => console.log("     http://" + ip + ":" + PORT + "/"));
  } else {
    console.log("   未检测到局域网 IP，请确认电脑已连接 Wi-Fi。");
  }
  console.log("");
  console.log("   停止服务: 关闭本窗口，或按 Ctrl+C");
  console.log("  ==================================================");
  console.log("");
});
