import URI from 'urijs';

import { hasChinese, replaceAll } from './str';

const utmParams = [
  'utm_source',
  'utm_medium',
  'utm_term',
  'utm_content',
  'utm_campaign',
  'utm_reader',
  'utm_place',
  'utm_userid',
  'utm_cid',
  'utm_name',
  'utm_pubreferrer',
  'utm_swu',
  'utm_viz_id',
  'ga_source',
  'ga_medium',
  'ga_term',
  'ga_content',
  'ga_campaign',
  'ga_place',
  'yclid',
  '_openstat',
  'fb_action_ids',
  'fb_action_types',
  'fb_ref',
  'fb_source',
  'action_object_map',
  'action_type_map',
  'action_ref_map',
  'gs_l',
  'pd_rd_r@amazon.*',
  'pd_rd_w@amazon.*',
  'pd_rd_wg@amazon.*',
  '_encoding@amazon.*',
  'psc@amazon.*',
  'ved@google.*',
  'ei@google.*',
  'sei@google.*',
  'gws_rd@google.*',
  'cvid@bing.com',
  'form@bing.com',
  'sk@bing.com',
  'sp@bing.com',
  'sc@bing.com',
  'qs@bing.com',
  'pq@bing.com',
  'feature@youtube.com',
  'gclid@youtube.com',
  'kw@youtube.com',
  '$/ref@amazon.&ast',
  '_hsenc',
  'mkt_tok',
  'hmb_campaign',
  'hmb_source',
  'hmb_medium',
  'fbclid',
  'spReportId',
  'spJobID',
  'spUserID',
  'spMailingID',
  'utm_mailing',
  'utm_brand',
  'CNDID',
  'mbid',
  'trk',
  'trkCampaign',
  'sc_campaign',
  'sc_channel',
  'sc_content',
  'sc_medium',
  'sc_outcome',
  'sc_geo',
  'sc_country',
];

/** 简单地对 URL 进行解析 */
export function parseUrl(url: string) {
  const match = url.match(
    /^(http|https|ftp)?(?:[\:\/]*)([a-z0-9\.-]*)(?:\:([0-9]+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/i,
  );
  const ret: any = new Object();

  if (!match) {
    return {};
  }

  ret.protocol = '';
  ret.host = match[2];
  ret.port = '';
  ret.path = '';
  ret.query = '';
  ret.fragment = '';

  if (match[1]) {
    ret.protocol = match[1];
  }

  if (match[3]) {
    ret.port = match[3];
  }

  if (match[4]) {
    ret.path = match[4];
  }

  if (match[5]) {
    ret.query = match[5];
  }

  if (match[6]) {
    ret.fragment = match[6];
  }

  return ret;
}

/** 移除 UTM 相关的参数 */
export function removeUtmParamsFromQuery(originUrl: string) {
  if (!originUrl) {
    return originUrl;
  }

  const uriObj = URI(originUrl);

  utmParams.forEach(p => {
    uriObj.removeQuery(p);
  });

  return uriObj.href();
}

// See http://medialize.github.io/URI.js/docs.html
export function newUri(href: string): URI {
  return URI(href);
}

/** 从 Url 中获取到最后的文件名 */
export function getFileNameFromUrl(href: string): string {
  return URI(href).filename();
}

/** 获取当前 Url 中的参数 */
export function getUrlParamWithRegex(name: string) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

/** 从 Url 中获取参数 */
export function getUrlParam(href: string, key: string) {
  // 首先从 href 中获取，不存在则从 query 中获取
  const uriObj = newUri(href);
  const sp = new URLSearchParams(uriObj.query());
  const value = sp.get(key);

  if (value) {
    return value;
  }

  // 不存在，则从 hash 中获取
  const hash = uriObj.hash();
  const hashUriObj = newUri(hash.replace('#', 'http://domain'));

  const hashSp = new URLSearchParams(hashUriObj.query());

  return hashSp.get(key);
}

/** 为某个 URL 添加查询参数 */
export function addQueryParams(url: string, params: Record<string, string>) {
  const uri = URI(url);
  return uri
    .addQuery({
      ...params,
    })
    .href();
}

/**
 * 添加默认的图片 URI 后缀
 * @param square 是否裁剪为正方形
 * @param cropSize 裁剪的尺寸
 * @param useJpeg 是否强制转化为 Jpeg
 */
export function setOssResize(
  url: string,
  width = 150,
  {
    square = false,
    cropSize = 150,
    useJpeg = false,
    watermark,
  }: {
    square?: boolean;
    cropSize?: number;
    useJpeg?: boolean;
    watermark?: {
      type: 'text' | 'image';
      base64Text: string;
      color: string;
      fontSize: number;
      opacity: number;
      // 单独右下角的透明度
      seOpacity: number;
    };
  } = {},
) {
  // 过滤无效的 url
  if (!url) {
    return url;
  }

  if (url.indexOf('aliyuncs.com') === -1 || url.indexOf('Signature') > -1) {
    return url;
  }

  const useJpegParam = 'format,jpg/interlace,1';
  const setWidthParam = `resize,w_${width}`;
  const cropParam = `crop,w_${cropSize},h_${cropSize},g_center`;

  const params = [];

  if (width) {
    params.push(setWidthParam);
  }

  if (useJpeg) {
    params.push(useJpegParam);
  }

  if (square) {
    params.push(cropParam);
  }

  if (watermark) {
    const {
      fontSize = 30,
      base64Text,
      color = 'FFFFFF',
      opacity = 100,
      seOpacity,
    } = watermark;

    const positions = ['nw', 'ne', 'center', 'sw', 'se'];
    const watermarkParam = (p: string, o: number) =>
      `watermark,type_d3F5LXplbmhlaQ,size_${fontSize},text_${base64Text},color_${color},t_${o},g_${p}`;

    positions.forEach(p => {
      params.push(watermarkParam(p, opacity));
    });

    if (seOpacity !== opacity) {
      params.push(watermarkParam('se', seOpacity));
    }
  }

  const uri = URI(url);

  return replaceAll(
    replaceAll(
      uri
        .addQuery({
          'x-oss-process': `image/${params.join('/')}`,
        })
        .href()
        .replace('http://', 'https://') || '',
      '%2C',
      ',',
    ),
    '%2F',
    '/',
  );
}

/**
 * 执行 URL 编码，注意避免多次重复
 * @param pureUri 如果是纯 Uri，则使用 URIComponent 进行全编码，及忽略可能的 # 参数情况
 */
export function encodeUri(uri: string, pureUri = false) {
  if (hasChinese(uri)) {
    // pureUri 即时将 # 等分隔符也认为是路径的一部分
    if (pureUri) {
      let originUri = encodeURI(uri);

      const reservedCharacters = ';,?@&=+$#';

      for (const c of reservedCharacters) {
        originUri = originUri.replaceAll
          ? originUri.replaceAll(c, encodeURIComponent(c))
          : replaceAll(originUri, c, encodeURIComponent(c));
      }

      return originUri;
    } else {
      const u: URI = newUri(uri);

      return `${u.scheme()}://${u.host()}${encodeURI(u.path())}`;
    }
  }

  return uri;
}
