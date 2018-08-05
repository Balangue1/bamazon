var mysql = require("mysql");
var inquirer = require("inquirer");

var Total = 0;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'Drum2o14@',
  database: 'bamazon'
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");

  selectAll();
});

// Selects all products from bamazon database

function selectAll() {
  console.log("Selecting all data for products...\n");
  var query = connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    console.log("Department_Id     Product_Name     Department_Name    Price     Stock_Quantity")
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].id + "                 " + res[i].product_name + "            " + res[i].department_name + "              " + res[i].price + "        " + res[i].stock_quantity)
    };
    idSelection();
  }
  );
}

function idSelection() {
  inquirer
    .prompt([
      {
        // Which item would the customer like to purchase   
        name: "id",
        type: "input",
        message: "What item number would you like to purchase?",
      },
      // How many would the customer like to purchase
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?"
      }
    ])
    .then(function (answers) {
      var query = "SELECT id, product_name, department_name, price, stock_quantity FROM products WHERE ?";

      connection.query(query, { id: answers.id }, function (err, res) {
        for (var i = 0; i < res.length; i++) {
          var total = res[i].price * answers.quantity

          var newInventory = res[i].stock_quantity - answers.quantity
          if (res[i].stock_quantity < answers.quantity) {
            console.log("Inefficient quantity.  Order cannot be fulfilled")

          } else {
            console.log("Order total: $ " + total);
            console.log("Updating quantity for item number...\n");

            var query = connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: newInventory
                },
                {
                  id: answers.id
                }
              ],
              function (err, res) {
              }
            );
          }
        }
        connection.end();
      }
      )
    });
}

