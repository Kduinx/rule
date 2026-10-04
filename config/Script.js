const daly_check_url = "http://www.google.com/generate_204";
const daly_check_interval = 240;
const daly_check_tolerance = 100;

const groupBaseOption = {
  timeout: 3000,
  url: daly_check_url,
  lazy: true,
};

const urlTestOption = {
    hidden: true,
    type: "url-test",
    interval: daly_check_interval,
    tolerance: daly_check_tolerance,
}

const selectOption = {
  hidden: false,
  type: "select",
}

const selectOption_proxies = [
  "新加坡",
  "日本",    
  "美国",
  "香港",
]

const proxyGroups = [
  {
    ...groupBaseOption,
    ...selectOption,
    name: "手动选择",
    proxies: selectOption_proxies
  },
  {
    ...groupBaseOption,
    ...selectOption,
    name: "Steam",
    proxies: selectOption_proxies
  },
  {
    ...groupBaseOption,
    ...selectOption,
    name: "Youtube",
    proxies: selectOption_proxies
  },
  {
    ...groupBaseOption,
    ...selectOption,
    name: "AI",
    proxies: selectOption_proxies
  },
  {
    ...groupBaseOption,
    ...urlTestOption,
    name: "新加坡",
    proxies: []
  },
  {
    ...groupBaseOption,
    ...urlTestOption,
    name: "日本",
    proxies: []
  },
  {
    ...groupBaseOption,
    ...urlTestOption,
    name: "美国",
    type: "url-test",
    proxies: []
  },
  {
    ...groupBaseOption,
    ...urlTestOption,
    name: "香港",
    proxies: []
  }
];

function getProxies(proxies) {
  const flagMap = {
    '🇸🇬': '新加坡',
    '🇯🇵': '日本',
    '🇺🇸': '美国',
    '🇭🇰': '香港'
  };
  return proxies.reduce((acc, proxy) => {
    const flag = proxy.name.trim().slice(0, 4);

    if (!flagMap.hasOwnProperty(flag)) {
      return acc;
    }

    let key = flagMap[flag];

    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(proxy.name);
    return acc;
  }, {});
}

function main(config) {
  const proxies = getProxies(config.proxies);

  config["proxy-groups"] = [];
  const newProxyGroups = proxyGroups.map((group) => {
    const newGroup = { ...group };
    if (proxies[group.name]) {
      newGroup.proxies = proxies[group.name];
    }
    return newGroup;
  });

  config["proxy-groups"].push(...newProxyGroups);
  return config;
}
