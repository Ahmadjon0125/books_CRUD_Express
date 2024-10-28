const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const bookRoutes = require('./routes/books');
app.use(bookRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)})