import { Client } from "../src";
import * as process from "node:process";

async function main() {
  const key = process.env.FOFA_KEY || "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // 输入key
  const baseUrl = process.env.FOFA_BASE_URL || "https://fofa.info";
  const client = new Client(key, baseUrl); // 将key传入fofa.Client类进行初始化和验证，并得到一个fofa client对象

  const queryStr = 'header="thinkphp" || header="think_template"';
  for (let page = 1; page <= 3; page++) {
    const userInfo = await client.getUserInfo();
    const fcoin = userInfo.fcoin;
    console.log(`fcoin: ${fcoin}`);
    const data = await client.search(queryStr, {
      size: 100,
      page,
      fields: ["ip", "city"].join(","),
    }); // 查询第page页数据的ip和城市
    for (const [ip, city] of data.results) {
      console.log(`${ip},${city}`); // 打印出每条数据的ip和城市
    }
  }
}

main();
