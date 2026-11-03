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

Pour l'instant, tant que la configuration n'est pas renseignée, la page informe les visiteurs que le service est en cours d'activation et bloque l'envoi.
