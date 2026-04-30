// import and destructure Sequelize class from the import
const { Sequelize, DataTypes } = require("sequelize")

// instantiate sequelize and provide it with location and credentials
const db = new Sequelize(process.env.DB_URL, {
	logging: true
})

// export for use in other areas of the project
module.exports = { db, Sequelize, DataTypes }