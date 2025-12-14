'use strict'

async function loadAccountTable() {
  try {
    const response = await fetch('/account/api/accounts')
    const accounts = await response.json()
    
    buildAccountTable(accounts)
  } catch (error) {
    console.error('Error loading accounts:', error)
    document.getElementById('accountDisplay').innerHTML = 
      '<p class="notice">Error loading account data.</p>'
  }
}

function buildAccountList(data) {
    console.log("buildAccountList");
    let accountList = document.querySelector("#accountDisplay");
    // Set up the table labels
    let dataTable = '<thead>';
    dataTable += '<tr><th>First Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>';
    dataTable += '</thead>';
    // Set up the table body
    dataTable += '<tbody>';
    // Iterate over  all the accounts in the array and put each in a row
    data.forEach(function (element) {
        console.log(element.account_id + ", " + element.account_email);
        dataTable += `<tr><td>${element.account_email}</td><td>${element.account_firstname} ${element.account_lastname}</td>`;
        dataTable += `<td><a href='/account/edit/${element.account_id}' title='Click to update'>Modify</a></td>`;
        dataTable += `<td><a href='/account/delete/${element.account_id}' title='Click to delete'>Delete</a></td></tr>`;
    })
    dataTable += '</tbody>';
    // Display the contents in the Inventory Management view
    accountList.innerHTML = dataTable;
}
