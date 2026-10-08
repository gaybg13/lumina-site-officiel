# Chœur Lumina — Site vitrine officiel

Site vitrine indépendant de l'application mobile et de l'espace choristes.

## Structure
- `index.html` : site public et sections
- `styles.css` : identité graphique bleu nuit et or, responsive, animations
- `app.js` : menu mobile, apparitions et formulaire de contact via messagerie
- `CNAME` : domaine OVH `choeurlumina.fr`

## Publication gratuite
1. Dans GitHub : **Settings > Pages**, choisir **Deploy from a branch**, branche `master`, dossier `/(root)`.
2. Dans **Settings > Pages > Custom domain**, saisir `choeurlumina.fr`.
3. Dans OVH : **Domaines > choeurlumina.fr > Zone DNS**, configurer les enregistrements A GitHub Pages recommandés par la documentation officielle et le `www` CNAME vers `gaybg13.github.io` si souhaité.
4. Ne PAS supprimer les MX/TXT de Zimbra (messagerie).
5. Activer **Enforce HTTPS** une fois le certificat disponible.

## À personnaliser avant lancement
- Photos et logo réels du chœur ; vrais partenaires et logos autorisés
- Dates de concerts confirmées et mentions légales / politique de confidentialité
- Formulaire actuel : ouvre l'application e-mail du visiteur, aucun envoi serveur ; remplacer par une solution compatible RGPD si réception directe requise

Le dépôt conserve l'historique de l'ancien projet 3D, même si les fichiers de la dernière version ont été remplacés.
