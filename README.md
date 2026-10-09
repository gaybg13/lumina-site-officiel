# Chœur Lumina — Site officiel

Site vitrine sur GitHub Pages, domaine `https://choeurlumina.fr`.
Pages publiques : accueil, Le Chœur, Prestations, Événements, Partenaires et Contact.

## Administration des contenus (Pages CMS)

Interface de connexion : **https://choeurlumina.fr/admin/** puis `https://app.pagescms.org/`.

1. Ouvrir Pages CMS et choisir **Se connecter avec GitHub**.
2. Autoriser l'application GitHub **Pages CMS** à accéder au dépôt `gaybg13/lumina-site-officiel`, de préférence **ce dépôt uniquement**.
3. Sélectionner le dépôt et sa branche `master`.
4. Le fichier `.pages.yml` présent à la racine configure les rubriques et les champs. Il n'y a pas de serveur WordPress à installer.
5. Modifier un champ, puis enregistrer / publier dans Pages CMS. La sauvegarde crée une modification GitHub et GitHub Pages redéploie automatiquement les fichiers.

### Rubriques éditables

- **01 — Accueil :** titre, introduction, image du groupe, accroches des catégories.
- **02 — Le chœur :** histoire, identité, répertoire, répétitions et animations.
- **03 — Prestations :** titre, description, photo principale, descriptifs des quatre formats.
- **04 — Événements :** introduction et message d'attente.
- **05 — Agenda :** ajouter un événement à la liste ; date, heure, lieu, affiche, description et lien facultatif. Cocher **Afficher sur le site ?** pour publier. Seuls les événements publiés et à venir apparaissent dans l'agenda.
- **06 — Partenaires :** présentation des collaborations.
- **07 — Partenaires — fiches :** nom, logo, description et site d'une structure. Cocher **Afficher sur le site ?** pour publier.
- **08 — Contact :** texte d'accueil, conseils et adresse email.

Les textes sont stockés dans `contenu/*.json` et les médias dans `assets/`. Le fichier `cms-content.js` charge les données et les affiche au-dessus du HTML existant pour conserver l'apparence et le fonctionnement actuels.

### Points à connaître

- L'authentification à Pages CMS est faite par **GitHub**. Ne transmettez jamais de mot de passe ou de token par email ou dans les fichiers du site.
- Le site reste **gratuit sur GitHub Pages** ; l'interface d'édition proposée est le service externe Pages CMS.
- Pour la première connexion, le propriétaire du dépôt doit installer / autoriser l'application Pages CMS. L'assistant ne peut pas donner ce consentement à sa place.
- Les changements éditoriaux sont chargés en JavaScript depuis les fichiers JSON. **Sans JavaScript, le HTML statique existant reste visible.** Cette première version privilégie la simplicité et ne reconstruit pas les pages HTML pour les moteurs de recherche.
- Si le formulaire de contact est utilisé, il **prépare un email dans le logiciel de messagerie** de l'utilisateur ; il n'envoie pas lui-même de message.
- Ne jamais saisir de données privées (mots de passe, clés API) dans les contenus CMS publics : les JSON sont publiés sur le site.

## Développement

Site statique HTML/CSS/JS sur la branche `master`. Chaque page conserve une version de base lisible sans le CMS. Le DOM est enrichi au chargement de `cms-content.js`. Si un fichier JSON ne peut pas être chargé, le texte déjà présent dans la page reste affiché.
