import blessed from 'blessed';

import { getStr } from '../i18n/languages.mjs';
import generateList from './list.mjs';

export default function loadForm(screen, files) {
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

		generateList(screen, names).then(list => {
			list.focus();
			screen.render();
		});
	});

	return form;
}
