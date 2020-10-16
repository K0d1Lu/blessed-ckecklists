#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import blessed from 'blessed';
import shelljs from 'shelljs';

import generateList from './modules/list.mjs';
import loadForm from './modules/form.mjs';
import { initLang, getStr } from './i18n/languages.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const screen = blessed.screen({
	smartCSR: true,
	title: 'Checklist'
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], () => {
	return process.exit(0);
});

fs.readdir(path.resolve(__dirname, './checklists'), (err, files) => {
	if (err) {
		console.error(err);
		return;
	}

	shelljs.exec('clear');

	const { lang, list, title } = yargs(hideBin(process.argv)).argv;

	initLang(lang).then(() => {
		if (title !== false) {
			blessed.BigText({
				parent: screen,
				top: 3,
				left: 'center',
				content: getStr('form.title').toUpperCase(),
				style: {
					fg: 'white'
				}
			});
		}

		if (list) {
			const alist = (Array.isArray(list) ? list : [list])
				.map(elem => `${elem.includes('.mjs') ? elem : elem + '.mjs'}`)
				.filter(name => files.includes(name));

			if (alist.length) {
				generateList(screen, alist).then(l => {
					l.focus();
					screen.render();
				});
			} else {
				blessed.text({
					parent: screen,
					top: 3,
					content: getStr('common.nofile'),
					style: {
						fg: 'white'
					}
				});
				screen.render();
			}
		} else {
			const form = loadForm(screen, files);
			form.focus();
			screen.render();
		}
	});
});
