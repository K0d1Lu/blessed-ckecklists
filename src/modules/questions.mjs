import blessed from 'blessed';

import { getStr } from '../i18n/languages.mjs';

export default function generateQuestions(parent, lists) {
	let top = 2;

	lists.forEach(q => {
		const questions = q.default || q;
		questions.forEach(question => {
			const { level = 'default' } = question;
			blessed.checkbox({
				parent,
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
}
