#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import blessed from 'blessed';

import generateList from './modules/list.mjs';
import loadForm from './modules/form.mjs';
import generateQuestions from './modules/questions.mjs';
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

fs.readdir(path.resolve(__dirname, '..'), (err, files) => {
	if (files.includes('clist.config.mjs')) {
		import(path.resolve(__dirname, '../clist.config.mjs')).then(config => {
			const conf = config.default;
			const files = [];

			if (conf.extends) {
				conf.extends.forEach(item => {
					let name, file;
					[name, file] = item.split('-');

					if (name === 'clist') {
						files.push(import(`./checklists/${file}.mjs`));
					}
				});
			}

			Promise.all(files).then(lists => {
				if (conf.list) {
					lists.push(conf.list);
				}

				initLang().then(() => {
					const form = blessed.form({
						parent: screen,
						width: '90%',
						top: 15,
						keys: true,
						vi: true
					});

					generateQuestions(form, lists);

					form.focus();
					screen.render();
				});
			});
		});
	} else {
		fs.readdir(path.resolve(__dirname, './checklists'), (err, files) => {
			if (err) {
				console.error(err);
				return;
			}

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
	}
});
