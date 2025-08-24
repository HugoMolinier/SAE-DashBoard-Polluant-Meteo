# D'airBoard

D'airBoard est un **dashboard interactif de suivi de la qualité de l'air**.  
Il permet de visualiser les données de pollution, la météo, et les alertes depuis différentes stations, avec des graphiques, des cartes interactives et la génération de rapports PDF.
C'est un projet académique à faire en 2 mois en équipe de 3 personnes.

---

## 🚀 Fonctionnalités principales

- **Graphiques dynamiques** : visualisation des polluants sur différentes périodes (aujourd'hui, 7 jours, 1 mois, 3 mois, 6 mois, période personnalisée).
- **Carte interactive** : localisation des stations de mesure avec pop-ups d’informations.
- **Filtrage avancé** : possibilité de sélectionner les polluants à afficher.
- **Météo locale** : affichage de la météo pour la région sélectionnée.
- **Calendrier** : visualisation des données par date.
- **Génération de PDF** : export des graphiques et données visibles dans un rapport PDF.
- **Mode jour / nuit** : interface adaptable selon l’heure.

---

## 📂 Structure du projet

```text
/DashBoard
├─ /Static
│  ├─ /css       -> fichiers CSS (forme.css, night.css, carte.css)
│  ├─ /js
│  │  ├─ /Model  -> modèles JS (ModelAlerte, ModelRecolte, ModelMeteo, ModelGraph, ModelCalendrier, ModelPDF)
│  │  ├─ init.js
│  │  ├─ carte.js
│  │  ├─ filtre.js
│  │  └─ generation_graphique.js
│  └─ /img       -> images et icônes
├─ urls.js        -> routes pour le dashboard
/API
└─ urls.js        -> routes pour l’API
server.js         -> serveur Express principal
index.html        -> page principale du dashboard
```

---

## ⚙️ Installation

1. Cloner le projet :

```bash
git clone <repo_url>
cd <projet>
```

Installer les dépendances :

```bash
npm install express
```

Lancer le serveur :

```bash
node server.js
```

Accéder au dashboard :

http://localhost:8080/

Accéder à l'API :

http://localhost:8080/api/

---

## 🛠️ Technologies utilisées

- Frontend : HTML5, CSS3, JavaScript

- Backend : Node.js, Express

- Bibliothèques supplémentaires : jsPDF, html2canvas, jQuery,D3.js, Billboard.js, OpenLayers
