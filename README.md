# FOFA JavaScript SDK Documentation

An easy-to-use wrapper for <a href="https://fofa.info/api"><font face="menlo">FOFA API</font></a> written in ts.

FOFA is a search engine for Internet-connected devices. `FOFA API` helps developers integrate FOFA data easily in their own projects.

## Documentaion
- <a href="README.md"> Documentation </a>
- <a href="README_CN.md"> 中文文档 </a>
- [Api Documentation](https://fofapro.github.io/fofa-py/index.html)

## Usage
```ts
import { Client } from "fofa-js";
import process from "node:process";

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
```
## License
This software is licensed under <a href="https://opensource.org/licenses/mit"><font face="menlo">MIT License</a>

Copyright (C) 2024 Fofa, Inc.
