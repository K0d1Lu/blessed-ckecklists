#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import blessed from 'blessed';
import shelljs from 'shelljs';

import { initLang, getStr } from './i18n/languages.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

fs.readdir(path.resolve(__dirname, './checklists'), (err, files) => {
	if (err) {
		console.error(err);
		return;
	}

	shelljs.exec('clear');

	const { lang } = yargs(hideBin(process.argv)).argv;

	initLang(lang).then(() => loadForm(files));
});

function loadForm(files) {
	const screen = blessed.screen({
		smartCSR: true,
		title: 'Checklist'
	});

	blessed.BigText({
		parent: screen,
		top: 3,
		left: 'center',
		content: getStr('form.title').toUpperCase(),
		style: {
			fg: 'white'
		}
	});

	const form = blessed.form({
		parent: screen,
		width: '90%',
		top: 15,
		keys: true,
		vi: true
	});

	blessed.text({
		parent: screen,
		top: 18,
		left: 5,
		content: getStr('form.introduction')
	});

	let top = 8;

	files.forEach(file => {
		blessed.checkbox({
			parent: form,
			name: 'list',
			content: file.split('.')[0],
			top: top + 2,
			left: 5
		});

		top += 2;
	});

	const submit = blessed.button({
		parent: form,
		name: 'submit',
		content: getStr('common.validate').toUpperCase(),
		top: top + 15,
		left: 'center',
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

	submit.on('press', () => {
		form.submit();
	});

	/**
	 * onSubmit we get an array of boolean with a length correponding to
	 * to the length of the inputs with name xxx minus the index of the selected element
	 *
	 * If the last element is selected, the array contains only one element, therefore we receive only the boolean
	 */
	form.on('submit', data => {
		// if data is not an array we picked up the last element
		let names = [];
		if (!Array.isArray(data.list) && data.list) {
			names = [files[files.length - 1]];
		} else {
			names = files
				.slice(files.length - data.list.length)
				.filter((item, index) => {
					return data.list[index];
				});
		}

		const promises = names.map(name => {
			return import(`./checklists/${name}`);
		});

		const newForm = blessed.form({
			parent: screen,
			width: '90%',
			top: 15,
			keys: true,
			vi: true
		});

		let top = 2;

		Promise.all(promises).then(lists => {
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

			newForm.focus();
			screen.render();
		});
	});

	// Quit on Escape, q, or Control-C.
	screen.key(['escape', 'q', 'C-c'], () => {
		return process.exit(0);
	});

	form.focus();

	screen.render();
}
