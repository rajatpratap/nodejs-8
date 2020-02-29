const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require('./controllers/error');
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views')

/* https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express */
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(express.static(path.join(__dirname, "public"))); /* target static .css styling */
app.use(errorController.get404);

app.listen(3000);
