# BEAUTY IN MOTION — site e-commerce (démo, projet EST)

Site statique HTML / CSS / JavaScript, sans framework ni serveur.

## Lancer le site
Ouvrir `index.html` dans un navigateur (Chrome, Safari, Firefox).
Si la vidéo ne se lance pas en local, lancer un petit serveur :
`python3 -m http.server` puis ouvrir http://localhost:8000

## Structure
- `index.html` — structure commune (bandeau promo, en-tête, pied de page, panier)
- `css/style.css` — charte graphique (couleurs du rapport, Poppins / Montserrat)
- `js/data.js` — produits, prix, avis, frais de livraison, codes promo (à modifier ici)
- `js/avatars.js` — avatars illustrés et animations d'application des soins
- `js/app.js` — navigation, boutique, fiches produits, panier, commande
- `images/` — photos produits, logo, vidéo de la routine

## Parcours d'achat
Accueil → Boutique → Fiche produit → Panier (code BIENVENUE10 ou GLOW15)
→ Commande (coordonnées, livraison, paiement) → Confirmation.
Le paiement par carte est simulé : aucune donnée bancaire n'est demandée.
