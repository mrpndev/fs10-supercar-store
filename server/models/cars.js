const { db, DataTypes } = require("../db")

const Cars = db.define(
	"cars",
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		make: {
			type: DataTypes.STRING,
			allowNull: false
		},
		model: {
			type: DataTypes.STRING,
			allowNull: false
		},
		year: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 1900
			}
		},
		mileage: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 0
			}
		},
		transmission: {
			type: DataTypes.STRING,
			allowNull: false
		},
		drivetrain: {
			type: DataTypes.ENUM("FWD", "RWD", "AWD"),
			allowNull: false,
		},
		color: {
			type: DataTypes.STRING,
			allowNull: false
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				min: 0,
			}
		}
	},
	{
		timestamps: true
	}
)

module.exports = { Cars }