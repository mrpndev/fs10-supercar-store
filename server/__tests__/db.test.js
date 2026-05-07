/* 
	! Important !
	* this is an example of Mocking
	* we scaffold the unit functionality to avoid other dependencies interacting
	* this way our unit test only checks the specific unit of measure
	* in this instance, it is database instantiation itself
	* nothing else is in the way
*/

const { Sequelize } = require("sequelize")
require("dotenv").config()

test("Database Instantiated", () => {
	const moqDB = new Sequelize(process.env.DB_URL)
	expect(moqDB).toBeDefined()
})

// TODO: ensure URL is there
test("DB Connection String Exists", () => {
	expect(process.env.DB_URL).toBeDefined()
})

// TODO: ensure that the URL has username, password, port, and database name (WITHOUT EXPOSING THOSE VALUES)

test("Database Authentication", async () => {
	const moqDB = new Sequelize(process.env.DB_URL)
	expect(moqDB.authenticate()).resolves.not.toThrow()
})