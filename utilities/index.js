const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
       
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
     
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the Vehicle Detail View HTML
* ************************************ */
Util.buildVehicleDetail = async function (data) {
  let details
  if (data.length > 0) {
    details = '<ul id="inv-detail">'
    data.forEach((vehicle) => {
      details += '<li class="inv-card-detail">'
      details += '<header class="inv-header">'
      details += '<h2 class="inv-title">' + vehicle.inv_make + " " + vehicle.inv_model + `</h2>`
      details += '<span>$' 
       + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      details += '</header>'
      details += '<img src="' + vehicle.inv_image
       + '" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model + '">'     
      details += '<p class="inv-year"><strong>Year:</strong>' + vehicle.inv_year + '</p>'
      details += '<p class="inv-desc"><strong>Description:</strong>' + vehicle.inv_description +'</p>'
      details += '<p class="inv-miles"><strong>Miles:</strong>' 
       + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
      details += '<p class="inv-color"><strong>Color:</strong>' + vehicle.inv_color +'</p>'
      details += '</li>'
    })
    details += '</ul>'
  } else {
    details = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return details
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ************************
 * Constructs drop-down slelect list for classification
 ************************** */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

module.exports = Util