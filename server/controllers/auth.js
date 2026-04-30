const { User } = require("../models/auth");
// import your bcrypt dependency
const bcrypt = require("bcryptjs");
// import our salt value and wrap into number to avoid string type conversion
const SALT = Number(process.env.SALT);
// import your jsonwebtoken
const jwt = require("jsonwebtoken")
// create your secret key and import it here
const JWT_KEY = process.env.JWT_KEY

async function registerUser(req, res) {
	try {
		// destructure content of your body that you will need
		const { fullName, email, password } = req.body;

		// validate data incoming from the client
		if (fullName && email && password) {
			
			// call create on your User schema and pass the data
			const newUser = await User.create({
				fullName,
				email,
				// utilize bcrypt to hash the incoming password prior to saving it
				password: bcrypt.hashSync(password, SALT),
			});

			console.log(newUser);

			// Generate a token
			const token = jwt.sign(
				// payload (user id information to reference later)
				{ id: newUser.dataValues.id },
				// secret key
				JWT_KEY,
				// options (expiration here)
				{ expiresIn: "24h" }
			)
			
			res.status(201).json({
				message: "User created",
				email: newUser.dataValues.email,
				// send the token to the client
				token
			});
		} else {
			// throw error in case client did not provide sufficient info
			throw new Error("Please provide required information");
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: `${err}` });
	}
}

async function loginUser(req, res) {
	try {
		// destructuring email and password from body
		const { email, password } = req.body;
		
		// perform input validation
		if (!email || !password) {
			throw new Error("Please provide email and password");
		}
		
		// findOne accepts a query object where we match email from db to email from req
		const foundUser = await User.findOne({ where: { email } });
		// hint: { where: { email }} is the same as { email: email }
		
		if (!foundUser) {
			throw new Error("User not found");
		}
		
		const { dataValues: user } = foundUser;
		// an example of providing an alias to a destructured object property
		// const dataValue = foundUser.dataValues
		
		// run bcrypt compare to check req pwd againts db pwd
		// ! async operation which means we need to await it
		const verifyPwd = await bcrypt.compare(password, user.password)
		console.log("RESULT OF VERIFY PWD", verifyPwd)
		
		if (!verifyPwd) {
			throw new Error("Invalid password");
		}
		
		// Generate a token to refresh when logging in
		
		// Generate a token
		const token = jwt.sign(
			// payload
			{ id: user.id },
			// secret key
			JWT_KEY,
			// options (expiration here)
			{ expiresIn: "24h" }
		)
		
		res.status(200).json({
			message: "Logged in",
			user,
			token
		});

	} catch (err) {
		console.log(err);
		res.status(500).json({ message: `${err}` });
	}
}

module.exports = { registerUser, loginUser };
