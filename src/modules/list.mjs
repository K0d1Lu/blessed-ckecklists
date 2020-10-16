import blessed from 'blessed';

import { getStr } from '../i18n/languages.mjs';

export default function generateList(screen, names) {
	const promises = names.map(name => {
		return import(`../checklists/${name}`);
	});

	const newForm = blessed.form({
		parent: screen,
		width: '90%',
		top: 15,
		keys: true,
		vi: true
	});

	let top = 2;

	return Promise.all(promises).then(lists => {
		lists.forEach(q => {
			const questions = q.default;
			questions.forEach(question => {
				const { level = 'default' } = question;
				blessed.checkbox({
					parent: newForm,
					name: 'list',
					content: getStr(question.question),
					top: top + 2,
					left: 5,
					style: {
						bold: true,
						fg: () => {
							let color = '';
							switch (level) {
								case 'warn':
									color = '#db9f12';
									break;
								case 'error':
									color = '#eb4034';
									break;
								default:
									color = 'white';
							}
							return color;
						}
					}
				});

				top += 2;
			});
		});

		return newForm;
	});
}
