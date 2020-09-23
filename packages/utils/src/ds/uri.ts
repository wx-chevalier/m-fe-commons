import URI from 'urijs';
import { hasChinese } from './str';

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

/** 获取当前 url 中的参数 */
export function getUrlParamWithRegex(name: string) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

/** 从 Url 中获取参数 */
export function getUrlParam(href: string, key: string) {
  // 首先从 href 中获取，不存在则从 token 中获取
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

export function addQueryParams(url: string, params: Record<string, string>) {
  const uri = URI(url);
  return uri
    .addQuery({
      ...params,
    })
    .href();
}

/** 添加默认的图片 URI 后缀 */
export function setOssResize(url: string, width = 150) {
  // 过滤无效的 url
  if (!url) {
    return url;
  }

  if (url.indexOf('aliyuncs.com') === -1 || url.indexOf('Signature') > -1) {
    return url;
  }

  const uri = URI(url);

  return (
    uri
      .addQuery({
        'x-oss-process': `image/resize,w_${width}`,
      })
      .href()
      .replace('http://', 'https://') || ''
  );
}

/** 执行 URL 编码，注意避免多次重复 */
export function encodeUri(uri: string) {
  if (hasChinese(uri)) {
    return encodeURI(uri);
  }

  return uri;
}
