let i18n;

export function initLang(language = 'fr') {
	return import(`./${language}_${language.toUpperCase()}.mjs`).then((lang) => {
		i18n = lang.default;
	});
}

export function getStr(path) {
	const properties = path.split('.');
	let temp = i18n;

	properties.forEach((property) => {
		if (temp[property]) {
			temp = temp[property];
		}
	});

	return typeof temp === 'string' ? temp : path;
}
