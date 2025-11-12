const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationID = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        errors: null
    })
}

/* ***************************
 *  Build Vehicle Detail View
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
    const vehicleId = req.params.vehicleId
    const data = await invModel.getVehicleDetail(vehicleId)
    const grid = await utilities.buildVehicleDetail(data)
    let nav = await utilities.getNav()
    res.render("./inventory/detail", {
        title: data[0].inv_make + " " + data[0].inv_model,
        nav,
        grid,
        errors: null
    })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
 let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
})
}

/* ****************************************
*  Process adding classification
* *************************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body  
  const addResult = await invModel.addClassification(classification_name)

  if (addResult) {
    req.flash("notice", "New classification added.")
    res.redirect("/inv")
  } else {    
    req.flash("notice", "Error adding classification.")
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) { 
  let nav = await utilities.getNav()
  let classSelect = await utilities.buildClassificationList()

  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classSelect,
    errors: null
})
}

/* ****************************************
*  Process adding inventory
* *************************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classSelect = await utilities.buildClassificationList()
  const { inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_thumbnail,
    inv_image,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body  
  const addResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_thumbnail,
    inv_image,
    inv_price,
    inv_miles,
    inv_color,
    classification_id)

  if (addResult) {
    req.flash("notice", "New inventory added.")    
    res.status(201).render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null
  })
  } else {    
    req.flash("notice", "Sorry, there was an error adding to inventory.")
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classSelect,
      errors: null
    })
  }
}

module.exports = invCont