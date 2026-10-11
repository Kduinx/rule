/**
 * 适用于安卓版（mihomo 内核客户端，如 ClashMetaForAndroid / FlClash）的覆写脚本
 *
 * 与桌面版 config/Script.js 的差异：
 *  1. 入口同样是 main(config)，兼容移动端 JS 引擎；
 *  2. 补充安卓上常用的 TUN 配置（enable/stack/dns-hijack/auto-route 等），
 *     若客户端已在 App 内托管 TUN，可删掉 ANDROID_TUN 中的对应字段；
 *  3. DNS / sniffer / rule-providers / rules 与桌面版保持一致。
 */

const daily_check_url = "http://www.google.com/generate_204";
const daily_check_interval = 240;
const daily_check_tolerance = 100;

// 选择组名称
const SELECT_GROUP_NAMES = ["手动选择", "Steam", "Youtube", "AI"];

// 需要额外追加的选项
const SELECT_GROUP_EXTRA_PROXIES = {
  Steam: ["DIRECT"],
};

const groupBaseOption = {
  timeout: 3000,
  url: daily_check_url,
  lazy: true,
};

const urlTestOption = {
  hidden: true,
  type: "url-test",
  interval: daily_check_interval,
  tolerance: daily_check_tolerance,
};

const selectOption = {
  hidden: false,
  type: "select",
};

// ===== rule-providers 公共模板（对应 YAML anchors）=====

const RULE_PROVIDER_TEMPLATES = {
  ip: {
    type: "http",
    behavior: "ipcidr",
    format: "mrs",
    interval: 86400,
  },
  domain: {
    type: "http",
    behavior: "domain",
    format: "mrs",
    interval: 86400,
  },
  domain_text: {
    type: "http",
    behavior: "domain",
    format: "text",
    interval: 86400,
  },
};

const RULE_PROVIDERS = {
  fakeipfilter_cn: {
    ...RULE_PROVIDER_TEMPLATES.domain_text,
    url: "https://raw.githubusercontent.com/Kduinx/rule/main/rules/fakeipfilter-cn.list",
  },
  "fakeipfilter_!cn": {
    ...RULE_PROVIDER_TEMPLATES.domain_text,
    url: "https://raw.githubusercontent.com/Kduinx/rule/main/rules/fakeipfilter-!cn.list",
  },
  private_ip: {
    ...RULE_PROVIDER_TEMPLATES.ip,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.mrs",
  },
  private_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.mrs",
  },
  cn_ip: {
    ...RULE_PROVIDER_TEMPLATES.ip,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs",
  },
  cn_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs",
  },
  "geolocation-!cn_domain": {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/geolocation-!cn.mrs",
  },
  steamcn_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/steam@cn.mrs",
  },
  steam_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/steam.mrs",
  },
  youtube_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs",
  },
  "category-ai-!cn_domain": {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ai-!cn.mrs",
  },
  google_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.mrs",
  },
  google_ip: {
    ...RULE_PROVIDER_TEMPLATES.ip,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/google.mrs",
  },
  tiktok_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/tiktok.mrs",
  },
  microsoft_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.mrs",
  },
  microsoftcn_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft@cn.mrs",
  },
  github_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/github.mrs",
  },
  apple_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/apple.mrs",
  },
  applecn_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/apple@cn.mrs",
  },
  apple_ip: {
    ...RULE_PROVIDER_TEMPLATES.ip,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo-lite/geoip/apple.mrs",
  },
  telegram_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.mrs",
  },
  telegram_ip: {
    ...RULE_PROVIDER_TEMPLATES.ip,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.mrs",
  },
  cloudflare_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cloudflare.mrs",
  },
  vscode_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain_text,
    url: "https://raw.githubusercontent.com/Kduinx/rule/main/rules/vscode.list",
  },
  direct_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain_text,
    url: "https://raw.githubusercontent.com/Kduinx/rule/main/rules/direct.list",
  },
  xiaomi_domain: {
    ...RULE_PROVIDER_TEMPLATES.domain,
    url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/xiaomi.mrs",
  },
};

const RULES = [
  "AND,((RULE-SET,geolocation-!cn_domain),(DST-PORT,443),(NETWORK,UDP)),REJECT",
  "RULE-SET,private_ip,DIRECT,no-resolve",
  "RULE-SET,private_domain,DIRECT",
  "RULE-SET,direct_domain,DIRECT",
  "RULE-SET,category-ai-!cn_domain,AI",
  "RULE-SET,cloudflare_domain,手动选择",
  "RULE-SET,youtube_domain,Youtube",
  "RULE-SET,google_domain,手动选择",
  "RULE-SET,github_domain,手动选择",
  "RULE-SET,vscode_domain,DIRECT",
  "RULE-SET,microsoftcn_domain,DIRECT",
  "RULE-SET,microsoft_domain,手动选择",
  "RULE-SET,xiaomi_domain,DIRECT",
  "RULE-SET,applecn_domain,DIRECT",
  "RULE-SET,apple_domain,手动选择",
  "RULE-SET,telegram_domain,手动选择",
  "RULE-SET,tiktok_domain,手动选择",
  "RULE-SET,steamcn_domain,DIRECT",
  "RULE-SET,steam_domain,Steam",
  "RULE-SET,geolocation-!cn_domain, 手动选择",
  "RULE-SET,google_ip,手动选择",
  "RULE-SET,apple_ip,手动选择",
  "RULE-SET,telegram_ip,手动选择",
  "RULE-SET,cn_ip,DIRECT",
  "MATCH,手动选择",
];

// 安卓常用 TUN 配置；若 App 内已托管 TUN，可删除不需要的字段
const ANDROID_TUN = {
  enable: true,
  stack: "mixed",
  "dns-hijack": ["any:53"],
  "auto-route": true,
  "auto-detect-interface": true,
  "route-exclude-address-set": ["cn_ip", "23.200.230.0/24"],
};

const OVERRIDE = {
  "tcp-concurrent": true,
  tun: ANDROID_TUN,
  sniffer: {
    enable: true,
    "force-dns-mapping": true,
    "parse-pure-ip": true,
    "override-destination": true,
    sniff: {
      HTTP: {
        ports: [80, "8080-8090"],
        "override-destination": true,
      },
      TLS: {
        ports: [443, 8443],
      },
      QUIC: {
        ports: [443, 8443],
      },
    },
  },
  dns: {
    enable: true,
    "cache-algorithm": "arc",
    ipv6: false,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "198.18.0.0/16",
    "fake-ip-filter": [
      "+.msftconnecttest.com",
      "+.msftncsi.com",
      "rule-set:fakeipfilter_cn",
      "rule-set:fakeipfilter_!cn",
      "rule-set:private_domain",
      "rule-set:cn_domain",
    ],
    "default-nameserver": ["https://223.5.5.5/dns-query"],
    "direct-nameserver": ["system"],
    "direct-nameserver-follow-policy": false,
    "nameserver-policy": {
      "+.msftconnecttest.com": ["system"],
      "+.msftncsi.com": ["system"],
      "rule-set:cn_domain,private_domain,fakeipfilter_cn,steamcn_domain,microsoftcn_domain,applecn_domain": [
        "https://dns.alidns.com/dns-query#disable-qtype-65=true",
        "https://doh.pub/dns-query#disable-qtype-65=true",
      ],
      "rule-set:cloudflare_domain": [
        "https://1.1.1.1/dns-query#默认代理&disable-qtype-65=true",
      ],
      "rule-set:fakeipfilter_!cn": [
        "https://8.8.8.8/dns-query#默认代理&disable-qtype-65=true",
      ],
    },
    nameserver: [
      "https://8.8.8.8/dns-query#默认代理&ecs=223.5.5.0/24",
    ],
    fallback: ["https://8.8.8.8/dns-query#默认代理"],
    "fallback-filter": {
      geoip: true,
      "geoip-code": "CN",
    },
  },
  "rule-providers": RULE_PROVIDERS,
  rules: RULES,
};

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// 深度合并：普通对象递归合并，数组与基础类型直接覆盖
function mergeConfig(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override;
  }

  const result = { ...base };
  Object.keys(override).forEach((key) => {
    result[key] = mergeConfig(base[key], override[key]);
  });
  return result;
}

function isRegionalIndicator(codePoint) {
  return codePoint >= 0x1f1e6 && codePoint <= 0x1f1ff;
}

function getFlag(name) {
  const chars = Array.from(String(name).trim());
  if (chars.length < 2) {
    return null;
  }

  const first = chars[0].codePointAt(0);
  const second = chars[1].codePointAt(0);
  if (!isRegionalIndicator(first) || !isRegionalIndicator(second)) {
    return null;
  }

  return chars[0] + chars[1];
}

function getProxies(proxies) {
  if (!Array.isArray(proxies)) {
    return {};
  }

  return proxies.reduce((acc, proxy) => {
    const flag = getFlag(proxy.name);
    if (!flag) {
      return acc;
    }

    if (!acc[flag]) {
      acc[flag] = [];
    }
    acc[flag].push(proxy.name);
    return acc;
  }, {});
}

function main(config) {
  // 先应用覆写内容
  const merged = mergeConfig(config, OVERRIDE);

  const grouped = getProxies(merged.proxies);
  const regionFlags = Object.keys(grouped);

  const selectGroups = SELECT_GROUP_NAMES.map((name) => ({
    ...groupBaseOption,
    ...selectOption,
    name,
    proxies: regionFlags.concat(SELECT_GROUP_EXTRA_PROXIES[name] || []),
  }));

  const regionGroups = regionFlags.map((flag) => ({
    ...groupBaseOption,
    ...urlTestOption,
    name: flag,
    proxies: grouped[flag],
  }));

  merged["proxy-groups"] = selectGroups.concat(regionGroups);
  return merged;
}
