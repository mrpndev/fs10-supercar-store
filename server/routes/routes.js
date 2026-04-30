const router = require("express").Router();
const { getAll, getFilter, createCar, updateCar, deleteCar } = require("../controllers/routes");

// GET /all
router.get("/all", getAll);
// GET /filter
router.get("/filter", getFilter);
// POST /create
router.post("/create", createCar);
// PUT /:id
router.put("/:id", updateCar);
// DELETE /:id
router.delete("/:id", deleteCar);

module.exports = router;
