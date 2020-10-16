import blessed from 'blessed';

import generateQuestions from './questions.mjs';

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

	return Promise.all(promises).then(lists => {
		generateQuestions(newForm, lists);

		return newForm;
	});
}
