import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { encodeUri } from '../ds';

/** 从 URL 中获取图片的 Base64 */
export async function getImageAsBase64(url: string) {
  return axios
    .get(encodeUri(url), {
      responseType: 'arraybuffer',
    })
    .then(response => Buffer.from(response.data, 'binary').toString('base64'));
}

/** AxiosApi 定义 */
interface ResultNotice {
  title: string;
  content: string;
}

enum HttpMethods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

interface BaseConfig {
  url: string;
  params?: any;
  successNotice?: ResultNotice;
  errorNotice?: ResultNotice;
}

interface PostConfig extends BaseConfig {
  data: any;
}

export class AxiosApi {
  axiosAgent: AxiosInstance;
  quickAxiosAgent: AxiosInstance;
  resultNotice = (...args: string[]) => {};

  constructor(protected baseUrl: string) {
    // 创建 Axios 实例
    this.axiosAgent = axios.create({
      baseURL: baseUrl,
      timeout: 30 * 1000,
    });

    this.quickAxiosAgent = axios.create({
      baseURL: baseUrl,
      timeout: 1 * 1000,
    });
  }

  async get<T>(config: BaseConfig, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.GET, config, extra) || ({} as any);
  }

  async quickGet<T>(config: BaseConfig, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.GET, config, extra, true) || ({} as any);
  }

  async post<T>(config: PostConfig, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.POST, config, extra) || ({} as T);
  }

  async delete<T>(config: BaseConfig, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.DELETE, config, extra);
  }

  async put<T>(config: PostConfig, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.PUT, config, extra);
  }

  async patch<T>(config: PostConfig, extra?: AxiosRequestConfig) {
    return this.request<T>(HttpMethods.PATCH, config, extra);
  }

  get agentList() {
    return [this.axiosAgent];
  }

  async request<T>(
    method: HttpMethods,
    config: BaseConfig | PostConfig,
    extra: AxiosRequestConfig = {},
    quick = false,
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      method: method,
      url: config.url,
      params: config.params || {},
      ...extra,
    };
    if (
      method === HttpMethods.POST ||
      method === HttpMethods.PUT ||
      method === HttpMethods.PATCH
    ) {
      requestConfig.data = (config as PostConfig).data || {};
    }

    try {
      const result = await (quick
        ? this.quickAxiosAgent
        : this.axiosAgent
      ).request<T>(requestConfig);
      if (config.successNotice) {
        this.resultNotice(
          'success',
          config.successNotice.title,
          config.successNotice.content,
        );
      }
      return result.data as T;
    } catch (error) {
      if (config.errorNotice) {
        this.resultNotice(
          'error',
          config.errorNotice.title,
          config.errorNotice.content,
        );
      }

      delete error.config;

      throw error;
    }
  }
}
