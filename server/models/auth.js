// import db for connection
const { db, DataTypes } = require("../db");
// import Data Types to define type of data we want in our table

/* 
	? Schema
	* a well defined structure of our data
	* it allows us to outline:
		* columns
		* constraints
		* requirements
		* additional built-in functionality
*/

const User = db.define(
	"user",
	{
		fullName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				min: 10,
			},
		},
	},
	{
		timestamps: true,
	}
);

module.exports = { User }
