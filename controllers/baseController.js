const utilites = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilites.getNav()    
    res.render("index",{title: "Home", nav})
}

baseController.buildHomeError = async function(req, res){
    const nav = await utilites.getNav()
    res.render("index",{title: "Home", nav})
}

module.exports = baseController