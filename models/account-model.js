const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* ***************************
 *  Get account detail by id
 * ************************** */
async function getAccountDetail(id) {
  const data = await pool.query(
    `SELECT * FROM public.account WHERE account_id = $1`,
    [id]
  )
  return data.rows[0]
}

/* *****************************
*   Edit account
* *************************** */
async function editAccount(account_firstname, account_lastname, account_email, account_id){
  try {
    const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
     return await pool.query(sql, [account_firstname, account_lastname, account_email])
  } catch (error) {    
    return error.message
  }
}

/* *****************************
*   Edit account password
* *************************** */
async function editPassword(account_password, account_id){
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    return await pool.query(sql, [account_password, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Get all user accounts
* *************************** */
async function getAllAccounts(){
  try {
    const data = await pool.query("SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account")
    return data.rows
  } catch (error) {
    console.error("getAllAccounts error: " + error)
  }
}

/* *****************************
*   Get account types
* *************************** */
async function getAccountTypes(){
  const sql = 'SELECT unnest(enum_range(NULL::account_type)) as type'
  const data = await pool.query(sql)
  return data.rows.map(row => row.type)
}

/* *****************************
*   Update account type
* *************************** */
async function updateAccountType(account_id, account_type){
  try {
    const sql = "Update account SET account_type = $1 WHERE account_id = $2 RETURNING *"
    return await pool.query(sql, [account_type, account_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Delete account
* *************************** */
async function deleteAccount(account_id) {
  try {
    const sql = "DELETE FROM account WHERE account_id = $1 RETURNING *"
    return await pool.query(sql, [account_id])
  } catch (error) {
    return error.message
  }   
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountDetail,
  editAccount, editPassword,
  getAllAccounts,
  getAccountTypes,
  updateAccountType,
  deleteAccount
}