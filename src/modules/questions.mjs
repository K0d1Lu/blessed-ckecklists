import blessed from 'blessed';
import chalk from 'chalk';

import { getStr } from '../i18n/languages.mjs';

export default function generateQuestions(parent, lists) {
	const fullQuestions = [];
	let top = 2;

	lists.forEach(q => {
		const questions = q.default || q;
		questions.forEach(question => {
			fullQuestions.push(question);
			const { level = 'default' } = question;
			blessed.checkbox({
				parent,
				name: 'list',
				content: getStr(question.question),
				top: top + 2,
				left: 5,
				style: {
					bold: true,
					fg: () => (level === 'error' ? '#eb4034' : 'white')
				}
			});

			top += 2;
		});
	});

	const button = blessed.button({
		parent,
		name: 'submit',
		content: getStr('common.validate').toUpperCase(),
		top: top + 3,
		left: 5,
		shrink: true,
		padding: {
			top: 1,
			right: 2,
			bottom: 1,
			left: 2
		},
		style: {
			bold: true,
			fg: 'white',
			bg: 'green',
			focus: {
				inverse: true
			}
		}
	});

	button.on('press', () => {
		parent.submit();
	});

	parent.on('submit', data => {
		let answers = Array.isArray(data.list) ? data.list : [data.list];

		while (answers.length < fullQuestions.length) {
			answers.unshift(false);
		}

		let isValid = true;

		answers.forEach((answer, index) => {
			if (!answer && fullQuestions[index].level === 'error') {
				isValid = false;
			}
		});

		if (!isValid) {
			const test = chalk.red(getStr('common.listError'));
			throw test;
		}

		process.exit(0);
	});
}
