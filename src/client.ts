import axios, { AxiosInstance, AxiosProxyConfig } from "axios";
import * as process from "node:process";

interface SearchOptions {
  page?: string | number;
  size?: number;
  fields?: string;
  full?: boolean;
  next?: string;
  [key: string]: any;
}

class Client {
  private key: string;
  private baseUrl: string;
  private lang: string;
  private httpClient: AxiosInstance;

  private retryConfig = {
    retry: 5,
    retryDelay: 1000,
    maxRetryDelay: 60000,
    retryBackoff: 2,
  };

  constructor(key: string = "", baseUrl?: string, proxies?: AxiosProxyConfig) {
    this.key = key || process.env.FOFA_KEY || "";
    this.baseUrl = baseUrl || process.env.FOFA_BASE_URL || "https://fofa.info";
    this.lang = this.getLanguage();

    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 60 * 1000,
      headers: {
        "Accept-Encoding": "gzip",
      },
      proxy: proxies ?? undefined,
    });

    this.httpClient.interceptors.response.use((value) => {
      if (value.data["error"]) {
        return Promise.reject(value.data["errmsg"]);
      }
      return value;
    });
  }

  private getLanguage(): string {
    return `zh-CN`;
  }

  private encodeQuery(queryStr: string): string {
    return Buffer.from(queryStr).toString("base64");
  }

  async getUserInfo(): Promise<any> {
    const response = await this.httpClient.get("/api/v1/info/my", {
      params: {
        key: this.key,
        lang: this.lang,
      },
    });
    return response.data;
  }

  async search(queryStr: string, options: SearchOptions = {}): Promise<any> {
    const params: SearchOptions = {
      ...options,
      qbase64: this.encodeQuery(queryStr),
      key: this.key,
      lang: this.lang,
    };

    const response = await this.httpClient.get("/api/v1/search/all", {
      params,
    });
    return response.data;
  }

  async searchNext(
    queryStr: string,
    options: SearchOptions = {},
  ): Promise<any> {
    const params: SearchOptions = {
      ...options,
      qbase64: this.encodeQuery(queryStr),
      key: this.key,
      lang: this.lang,
    };

    const response = await this.httpClient.get("/api/v1/search/next", {
      params,
    });
    return response.data;
  }

  async searchStats(
    queryStr: string,
    options: SearchOptions = {},
  ): Promise<any> {
    const params: SearchOptions = {
      ...options,
      qbase64: this.encodeQuery(queryStr),
      key: this.key,
      lang: this.lang,
    };

    const response = await this.httpClient.get("/api/v1/search/stats", {
      params,
    });
    return response.data;
  }

  async searchHost(
    host: string,
    detail: boolean = false,
    opts: SearchOptions = {},
  ): Promise<any> {
    const params: SearchOptions = {
      ...opts,
      detail,
      key: this.key,
      lang: this.lang,
    };

    const response = await this.httpClient.get(`/api/v1/host/${host}`, {
      params,
    });
    return response.data;
  }

  async canUseNext(): Promise<boolean> {
    await this.searchNext("bad=query", { size: 1 });
    return true;
  }
}

export { Client };
