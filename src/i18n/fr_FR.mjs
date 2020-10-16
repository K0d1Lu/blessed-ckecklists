export default {
	common: {
		validate: 'valider',
		nofile:
			'Aucune checklist ne correspond à vos critères, veuillez vérifier vos informations.',
		listError:
			"checklist error : Une entrée obligatoire n'a pas été validée, merci d'effectuer les modifications nécessaires"
	},
	form: {
		title: 'checklist',
		introduction: 'Choisissez une checklist à charger parmis la liste suivante.'
	},
	security: {
		https:
			'HTTPS est utilisé sur toutes les pages et pour tous les contenus externes (plugins, images...)',
		htts: 'Le header HTTP est sur "Strict-Transport-Security"',
		csrf:
			'Vous vous assurer que les requêtes faites à votre serveur sont légitimes et proviennent bien de votre applcation afin de de prévenir des attaques CSRF'
	},
	accessibility: {
		contrast:
			'Le contraste de couleur doit être en adéquation avec les recommandations WCAG',
		headings:
			'Les balises <h/> doivent être utilisées à bon escient et dans le bon ordre (de h1 à h6)'
	}
};
