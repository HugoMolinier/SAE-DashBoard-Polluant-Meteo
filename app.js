/* REQUIRE */
const express = require('express');
const path = require('path');
const app = express();
const DashBoard = require('./DashBoard/urls');
const api = require('./API/urls');

/* CONF */
const PORT = 8080;

/* Static Files*/
app.use('/dashboard', express.static(path.join(__dirname, './DashBoard/Static')));


/* Router */
app.use('/api', api);
app.use('/', DashBoard);

/* Error files*/
app.use((req, res) => {
    res.status(404).send('Page non trouvée');
});

/* START */
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});