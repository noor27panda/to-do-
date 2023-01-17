const express = require("express")
const router = express.Router()
const controllers = require("../controllers")
const middlewares = require("../../middlewares/index")
const isAuth = require("../../middlewares/index")
router.post("/", controllers.register)
router.post("/login", controllers.login)
router.patch(":id", middlewares.isAuth, controllers.changestatus)

/*
router.get("/", ,controllers.getUser)  
router.put("/", controllers.update) // yamen
router.patch("/", controllers.restPassword) // Mais
router.delete("/", controllers.destroy) // Shafeeq

*/


module.exports = router