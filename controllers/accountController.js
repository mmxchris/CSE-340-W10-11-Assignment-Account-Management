const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const {isStrongPassword} = require("validator")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildManagementView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process login request
* *************************************** */
async function accountLogout(req, res, next) {
  try{
    req.session.destroy((err) => {
      if (err) {        
        return res.redirect("/account/")
      }
    })    

    res.clearCookie("jwt")
    res.redirect("/")
  } catch (error) {  
    next(error)
    return res.redirect("/")    
  }  
}

/* ****************************************
*  Deliver edit account view
* *************************************** */
async function buildEditAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountDetail(account_id)  
  let nav = await utilities.getNav()
  res.render("account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email
  })}

/* ****************************************
*  Process edit account request
* *************************************** */
async function editAccount(req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const editResult = await accountModel.editAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id    
  )
   if (editResult) {
    const accountData = await accountModel.getAccountByEmail(account_email)
    delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      req.flash("notice", "Account updated.")
      res.redirect("/account/")
    } else {
    req.flash("notice", "Sorry, the account update failed.")
    res.status(501).render("account/edit-account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

/* ****************************************
*  Process edit account password request
* *************************************** */
async function editAccountPassword(req, res, next) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  const accontData = await accountModel.getAccountDetail(account_id)
  
   // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.')
      req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/edit-account", {
      title: "Account Management",
      nav,
      errors: null,
      account_firstname: accontData.account_firstname,
      account_lastname: accontData.account_lastname,
      account_email: accontData.account_email,
      account_id: accontData.account_id  
    })
  }
  const editResult = await accountModel.editPassword(
    hashedPassword,
    account_id    
  )
   if (editResult) {
    req.flash("notice", "Password updated.")
    res.redirect("/account/")
    } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/edit-account", {
      title: "Account Management",
      nav,
      errors: null,
      account_firstname: accontData.account_firstname,
      account_lastname: accontData.account_lastname,
      account_email: accontData.account_email,
      account_id: accontData.account_id  
    })
  }
}

/* ****************************************
*  Deliver User Management view
* *************************************** */
async function buildUserManagement(req, res, next){
  let nav = await utilities.getNav()
  try {
    const users = await accountModel.getAllAccounts()
    
    res.render("account/user-management", {
      title: "User Account Management",
      nav,
      users,
      errors: null,
    })
  } catch (error) {
    req.flash("notice", "Sorry, there was an error loading user accounts.")
    res.status(500).render("account/user-management", {
      title: "User Account Management",
      nav,
      users: [],
      errors: null,
    })
  }
}

/* ****************************************
*  Deliver Admin-edit-account view
* *************************************** */
async function buildAdminEditAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id)  
  const editAccountData = await accountModel.getAccountDetail(account_id)
  const accountTypes = await accountModel.getAccountTypes() 
  let nav = await utilities.getNav()
  res.render("account/admin-edit-account", {
    title: "Edit User Account: " + editAccountData.account_firstname + " "
    + editAccountData.account_lastname,
    nav,
    errors: null,
    editAccountData,
    accountTypes
  })
}

async function updateAccountType(req, res, next) {
  const account_id = parseInt(req.body.account_id)
  const newAccountType = req.body.account_type
  const updateResults = await accountModel.updateAccountType(account_id, newAccountType)
  if (updateResults){
    req.flash("notice", "Account type updated.")
    res.redirect("/account/admin")
  } else {
    req.flash("notice", "Sorry, the account type failed to update.")
    res.redirect("/account/admin/edit/" + account_id)
  }
}

/* ****************************************
*  Process password reset
* *************************************** */
async function resetPassword(req, res, next) {
  console.log("resetPassword()")
  let nav = await utilities.getNav()
  const account_id = parseInt(req.body.account_id)
  const accountData = await accountModel.getAccountDetail(account_id)
  const accountTypes = await accountModel.getAccountTypes()
  const account_password = process.env.DEFAULT_PASSWORD
  //Validate default account password. This is done i nthe controller due to express-validator
  //being designed to validate request data. The default password is coming from an environment variable 
  if (!account_password) {
    req.flash("notice", "Sorry, the password reset failed.")
    return res.status(500).render("account/admin-edit-account", {
      title: "Edit User Account: " + accountData.account_firstname + " "
      + accountData.account_lastname,
      nav,
      errors: null,
      accountData,
      accountTypes
    })
  }

  const strongPassword = isStrongPassword(account_password, {
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })

  if (!strongPassword) {
    req.flash("notice", "Sorry, the password reset failed.It does not meet the requirements.")
    return res.status(500).render("account/admin-edit-account", {
      title: "Edit User Account: " + accountData.account_firstname + " "
      + accountData.account_lastname,
      nav,
      errors: null,
      accountData,
      accountTypes
    })
  }
  
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the password resetd.")
    res.status(500).render("account/admin-edit-account", {
     title: "Edit User Account: " + accountData.account_firstname + " "
    + accountData.account_lastname,
    nav,
    errors: null,
    accountData,
    accountTypes
    })
  }
  const editResult = await accountModel.editPassword(
    hashedPassword,
    account_id    
  )
   if (editResult) {
    req.flash("notice", "Password has been reset.")
    res.redirect("/account/admin")
    } else {
    req.flash("notice", "Sorry, the password reset failed.")
    res.status(501).render("account/admin-edit-account", {
    title: "Edit User Account: " + accountData.account_firstname + " "
    + accountData.account_lastname,
    nav,
    errors: null,
    accountData,
    accountTypes
  })
  }
}

/* ****************************************
*  Deliver Delete Account Confirmation
* *************************************** */
async function buildDeleteAccount(req, res, next) {
  const account_id = parseInt(req.params.account_id)  
  const accountData = await accountModel.getAccountDetail(account_id)
  let nav = await utilities.getNav()
  res.render("account/delete-account", {
    title: "Delete User Account: " + accountData.account_firstname + " "
    + accountData.account_lastname,
    nav,
    errors: null,
    accountData
  })
}

/* ****************************************
*   Delete Account
* *************************************** */
async function deleteAccount(req, res, next) {
  const account_id = parseInt(req.body.account_id)
  const deleteResults = await accountModel.deleteAccount(account_id)
  if (deleteResults){
    req.flash("notice", "Account deleted.")
    res.redirect("/account/admin")
  } else {
    req.flash("notice", "Sorry, the account failed to delete.")
    res.redirect("/account/admin/delete/" + account_id)
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagementView,
  accountLogout,
  buildEditAccount,
  editAccount,
  editAccountPassword,
  buildUserManagement,
  buildAdminEditAccount,
  updateAccountType,
  resetPassword,
  buildDeleteAccount,
  deleteAccount 
}