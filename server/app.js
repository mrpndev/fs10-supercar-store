require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors")

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "127.0.0.1";

const auth = require("./routes/auth");
const routes = require("./routes/routes");
// import session validation
const sessionValidation = require("./middlewares/validate")
// import our sequelize database config
const { db } = require("./db");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(auth);
app.use("/api", sessionValidation, routes);

app.listen(PORT, HOST, async () => {
	try {
		// establish connection to an existing database
		await db.authenticate();
		// syncs all of our schemas to the database
		await db.sync({ force: false })
		console.log(`[server] listening on ${HOST}:${PORT}`);
		console.log(`[database] running`);
	} catch (err) {
		console.error(err);
	}
});

/* 
	? Object Relational Mapper (ORM)
	* tool which allows communication with the database
	* it allows full CRUD operations on the datbase
	* it holds all transactions up to ACID standards
	* it also allows the handling of schema and model creation and modification
*/

/* 
	? Database Setup Notes
	* install using npm i sequelize pg pg-hstore (sequelize + postgres drivers)
	* add db path to your .env file
		* ex: "postgres://postgres:dbLocal@localhost:5433/supercarstore"
		*      dbtype     user      pwd       url    port   name of db
	* create a db.js file which will store connection string instance
	* create an instance of the database using pgAdmin or psql
	* import its content into app.js
*/
