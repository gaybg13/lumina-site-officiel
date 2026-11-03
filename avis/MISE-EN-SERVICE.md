# Mise en service : avis publics du site Chœur Lumina

Cette configuration concerne **choeurlumina.fr**, et non l'application interne.

1. Créer un **nouveau projet** sur https://console.firebase.google.com (par exemple lumina-site-avis).
2. Dans Authentication > Sign-in method, activer **Anonymous**. Cela ne demande aucun compte aux visiteurs.
3. Dans Firestore Database, créer la base. Dans **Rules**, remplacer les règles par le contenu exact de `avis/firestore.rules`, puis **Publier**. Ne pas utiliser les règles de test.
4. Dans les paramètres du projet > Vos applications, enregistrer une application **Web**. Copier sa configuration dans `avis/firebase-config.js` en remplaçant toutes les valeurs `A_COMPLETER`. L'API key Web Firebase est un identifiant public ; ne jamais déposer de clé de service privée.
5. Dans Authentication > Settings > Authorized domains, autoriser **choeurlumina.fr** (et www.choeurlumina.fr si utilisé).
6. Tester l'envoi d'un avis et son affichage depuis un navigateur privé. Un même identifiant anonyme ne peut publier qu'un avis. Pour la modération et le retrait sur demande, utiliser Firebase Console > Firestore Database > `publicReviews`, et supprimer le document concerné.
7. **Sécurité avant lancement public :** activer App Check (reCAPTCHA Enterprise pour Web) sur le nouveau projet et configurer le client en conséquence avant d'imposer son application à Firestore ; prévoir un dispositif anti-spam supplémentaire si nécessaire. L'identité anonyme n'empêche pas une personne de créer d'autres identités en effaçant les données de son navigateur.
8. Suivre l'utilisation et les coûts Firebase ; les accès publics et les requêtes temps réel peuvent occasionner une consommation.
   
Les avis sont affichés via JavaScript ; Google peut ne pas tous les explorer. Ne pas ajouter `AggregateRating` ou `Review` pour obtenir des étoiles sur la fiche de votre propre organisation : ces étoiles ne sont pas éligibles pour des avis auto-hébergés.

Le projet Firebase est maintenant connecté et les avis peuvent être publiés. La protection App Check reste à mettre en service.

## Activer App Check, sans couper le formulaire

1. Dans la console Firebase du projet `lumina-site-avis`, ouvrir **App Check** (rubrique Protection ou Exécuter selon l'interface).
2. Enregistrer l'application **Web** déjà créée, avec le fournisseur **reCAPTCHA Enterprise**. Créer/choisir une clé **de site Web** reCAPTCHA Enterprise associée au domaine `choeurlumina.fr` (et `www.choeurlumina.fr` si nécessaire). Garder privées les clés de service et secrets.
3. Copier la **clé de site publique** dans `window.LUMINA_REVIEWS_APP_CHECK_SITE_KEY` dans `avis/firebase-config.js`, ou la transmettre pour modification via GitHub. Laisser vide jusqu'à l'enregistrement effectif dans Firebase.
4. Une fois le code publié, tester la lecture et la publication depuis le vrai domaine, et consulter les **métriques App Check** dans Firebase.
5. **Après vérification des requêtes valides**, activer l'**application obligatoire (Enforce)** d'App Check pour **Cloud Firestore**. Ne pas activer trop tôt : sans jetons App Check valides, les avis ne pourront plus être lus ni enregistrés.
6. Pour la protection contre les abus à plus grande échelle, prévoir une limite de fréquence côté serveur, et si souhaité une modération des nouveaux avis. App Check réduit les requêtes automatisées non autorisées mais ne prouve pas qu'un avis provient d'un client réel.

Les règles `avis/firestore.rules` sont déjà appliquées manuellement dans la console Firebase. Mettre à jour ce fichier GitHub ne met pas à jour automatiquement les règles en production.
