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
  const classSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classSelect,
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
    classSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id) 
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleDetail(inv_id)
  let classSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ****************************************
*  Process editing inventory
* *************************************** */
invCont.editInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
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
  const editResult = await invModel.editInventory(
    inv_id,
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

  if (editResult) {
    const itemName = editResult.inv_make + " " + editResult.inv_model
    req.flash("notice", "The " + itemName + " was successfully updated.")    
    res.redirect("/inv")
  } else {
    const classSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`    
    req.flash("notice", "Sorry, the insert failed")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classSelect: classSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id) 
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleDetail(inv_id)
  let classSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`

  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    classSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  const inv_id = req.body.inv_id
  console.log(req.body)
  let nav = await utilities.getNav()  
  const deleteResult = await invModel.deleteInventoryItem(inv_id)
  if (deleteResult) {
    req.flash("notice", `The vehicle was successfully deleted.`)
    res.redirect("/inv/")
  } else {
   const itemData = await invModel.getVehicleDetail(inv_id)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    let classSelect = await utilities.buildClassificationList(itemData[0].classification_id)
    
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("./inventory/delete-inventory", {
      title: "Delete " + itemName,
      nav,
      classSelect,
      errors: null,
      inv_id: deleteResult[0].inv_id,
      inv_make: deleteResult[0].inv_make,
      inv_model: deleteResult[0].inv_model,
      inv_year: deleteResult[0].inv_year,
      inv_price: deleteResult[0].inv_price  
  })
  }
}

module.exports = invCont

