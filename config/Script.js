const regionFilters = {
	美国节点: { icon: '🇺🇸', filter: '美国' },
	日本节点: { icon: '🇯🇵', filter: '日本' },
	新加坡节点: { icon: '🇸🇬', filter: '新加坡|狮城' },
	香港节点: { icon: '🇭🇰', filter: '香港' },
};

const regionRules = Object.entries(regionFilters).map(([name, cfg]) => ({
	name,
	icon: cfg.icon,
	re: new RegExp(cfg.filter),
}));

function filter(list) {
	const grouped = {};
	for (const item of list) {
		for (const r of regionRules) {
			if (r.re.test(item.name)) {
				(grouped[r.name] ||= { icon: r.icon, items: [] }).items.push(item);
				break;
			}
		}
	}
	return grouped;
}

const toArr = (f) => (Array.isArray(f) ? f : [f]);

function main(config) {
	const proxies = config.proxies || [];

	const proxyGroups = [];

	const regionProxies = filter(proxies);

	const regions = Object.keys(regionFilters);

	proxyGroups.push(
		{
			name: 'Select',
			type: 'select',
			proxies: regions,
		},
		{
			name: 'Youtube',
			type: 'select',
			proxies: regions,
		},
		{
			name: 'AI',
			type: 'select',
			proxies: regions,
		},
		{
			name: 'Steam',
			type: 'select',
			proxies: regions,
		},
	);

	for (const [regionName, cfg] of Object.entries(regionFilters)) {
		const data = regionProxies[regionName];
		proxyGroups.push({
			name: regionName,
			icon: cfg.icon,
			type: 'url-test',
			proxies: data.items.map((p) => p.name),
			url: 'http://www.gstatic.com/generate_204',
			interval: 300,
			tolerance: 50,
		});
	}

	config['proxy-groups'] = proxyGroups;

	config['rules'] = [
		'AND,((RULE-SET,geolocation-!cn_domain),(DST-PORT,443),(NETWORK,UDP)),REJECT',
		'RULE-SET,private_ip,DIRECT,no-resolve',
		'RULE-SET,private_domain,DIRECT',
		'RULE-SET,direct_domain,DIRECT',
		'RULE-SET,category-ai-!cn_domain,AI',
		'RULE-SET,cloudflare_domain,Select',
		'RULE-SET,youtube_domain,Youtube',
		'RULE-SET,google_domain,Select',
		'RULE-SET,github_domain,Select',
		'RULE-SET,xiaomi_domain,DIRECT',
		'RULE-SET,vscode_domain,Select',
		'RULE-SET,nvidia_domain,DIRECT',
		'RULE-SET,microsoftcn_domain,DIRECT',
		'RULE-SET,microsoft_domain,Select',
		'RULE-SET,applecn_domain,DIRECT',
		'RULE-SET,apple_domain,Select',
		'RULE-SET,telegram_domain,Select',
		'RULE-SET,tiktok_domain,Select',
		'RULE-SET,steamcn_domain,DIRECT',
		'RULE-SET,steam_domain,Steam',
		'RULE-SET,geolocation-!cn_domain,Select',
		'RULE-SET,google_ip,Select',
		'RULE-SET,apple_ip,Select',
		'RULE-SET,telegram_ip,Select',
		'RULE-SET,cn_ip,DIRECT',
		'MATCH,Select',
	];

	const ruleAnchor = {
		ip: {
			type: 'http',
			behavior: 'ipcidr',
			format: 'mrs',
			interval: 86400,
		},
		domain: {
			type: 'http',
			behavior: 'domain',
			format: 'mrs',
			interval: 86400,
		},
		domain_text: {
			type: 'http',
			behavior: 'domain',
			format: 'text',
			interval: 86400,
		},
	};

	config['rule-providers'] = {
		fakeipfilter_cn: {
			...ruleAnchor.domain_text,
			url: 'https://raw.githubusercontent.com/Kduinx/rule/main/rules/fakeipfilter-cn.list',
		},
		'fakeipfilter_!cn': {
			...ruleAnchor.domain_text,
			url: 'https://raw.githubusercontent.com/Kduinx/rule/main/rules/fakeipfilter-!cn.list',
		},
		private_ip: {
			...ruleAnchor.ip,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.mrs',
		},
		private_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.mrs',
		},
		cn_ip: {
			...ruleAnchor.ip,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs',
		},
		cn_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs',
		},
		'geolocation-!cn_domain': {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/geolocation-!cn.mrs',
		},
		steamcn_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/steam@cn.mrs',
		},
		steam_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/steam.mrs',
		},
		youtube_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs',
		},
		'category-ai-!cn_domain': {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ai-!cn.mrs',
		},
		google_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.mrs',
		},
		google_ip: {
			...ruleAnchor.ip,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/google.mrs',
		},
		tiktok_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/tiktok.mrs',
		},
		microsoft_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.mrs',
		},
		microsoftcn_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft@cn.mrs',
		},
		github_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/github.mrs',
		},
		apple_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/apple.mrs',
		},
		applecn_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/apple@cn.mrs',
		},
		apple_ip: {
			...ruleAnchor.ip,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo-lite/geoip/apple.mrs',
		},
		telegram_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.mrs',
		},
		telegram_ip: {
			...ruleAnchor.ip,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.mrs',
		},
		cloudflare_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cloudflare.mrs',
		},
		vscode_domain: {
			...ruleAnchor.domain_text,
			url: 'https://raw.githubusercontent.com/Kduinx/rule/main/rules/vscode.list',
		},
		direct_domain: {
			...ruleAnchor.domain_text,
			url: 'https://raw.githubusercontent.com/Kduinx/rule/main/rules/direct.list',
		},
		xiaomi_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/xiaomi.mrs',
		},
		nvidia_domain: {
			...ruleAnchor.domain,
			url: 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/nvidia.mrs',
		},
	};

	config['ipv6'] = false;
	config['profile'] = {
		'store-selected': true,
		'store-filters': true,
	};
	config['dns'] = {
		enable: true,
		'cache-algorithm': 'arc',
		ipv6: false,
		'enhanced-mode': 'fake-ip',
		'fake-ip-range': '198.18.0.0/16',
		'fake-ip-filter': [
			'+.msftconnecttest.com',
			'+.msftncsi.com',
			'rule-set:fakeipfilter_cn',
			'rule-set:fakeipfilter_!cn',
			'rule-set:private_domain',
			'rule-set:cn_domain',
		],
		'default-nameserver': ['https://223.5.5.5/dns-query'],
		'direct-nameserver': ['system'],
		'direct-nameserver-follow-policy': false,
		'nameserver-policy': {
			'+.msftconnecttest.com': ['system'],
			'+.msftncsi.com': ['system'],
			'rule-set:cn_domain,private_domain,fakeipfilter_cn,steamcn_domain,microsoftcn_domain,applecn_domain':
				[
					'https://dns.alidns.com/dns-query#disable-qtype-65=true',
					'https://doh.pub/dns-query#disable-qtype-65=true',
				],
			'rule-set:cloudflare_domain': ['https://1.1.1.1/dns-query#默认代理&disable-qtype-65=true'],
			'rule-set:fakeipfilter_!cn': ['https://8.8.8.8/dns-query#默认代理&disable-qtype-65=true'],
		},
		'proxy-server-nameserver': [
			'https://cn.ali-oss.cn:44443/dns-query/6dafe708-d9d6-48cc-a768-e6ed3018a9ec',
			'https://hk.ali-oss.cn:44443/dns-query/6dafe708-d9d6-48cc-a768-e6ed3018a9ec',
		],
		nameserver: ['https://8.8.8.8/dns-query#默认代理&ecs=223.5.5.0/24'],
		fallback: ['https://8.8.8.8/dns-query#默认代理'],
		'fallback-filter': {
			geoip: true,
			'geoip-code': 'CN',
		},
	};
	config['ntp'] = {
		enable: true,
		'write-to-system': true,
	};
	config['tun'] = {
		enable: true,
		stack: 'mips',
		'dns-hijack': ['any:53', 'tcp://any:53'],
		'auto-route': true,
		'auto-redirect': true,
		'auto-detect-interface': true,
		'route-exclude-address-set': ['cn_ip'],
	};
	config['sniffer'] = {
		enable: true,
		'force-dns-mapping': true,
		'parse-pure-ip': true,
		'override-destination': true,
		sniff: {
			HTTP: {
				ports: [80, '8080-8090'],
				'override-destination': true,
			},
			TLS: {
				ports: [443, 8443],
			},
			QUIC: {
				ports: [443, 8443],
			},
		},
	};

	return config;
}
