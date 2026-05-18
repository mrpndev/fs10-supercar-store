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
require("./models/auth");
require("./models/cars");

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/api", auth);
app.use("/api", sessionValidation, routes);

async function startServer() {
	try {
		// Ensure models are registered and tables exist before serving requests.
		await db.authenticate();
		await db.sync({ force: false });

		app.listen(PORT, HOST, () => {
			console.log(`[server] listening on ${HOST}:${PORT}`);
			console.log(`[database] running`);
		});
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

// Ensure we have successfully authenticated the database
// Ensure we started the server

startServer();

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
