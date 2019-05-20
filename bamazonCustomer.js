var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");
require("dotenv").config();

var connection = mysql.createConnection({
    host: process.env.db_host,
    port: 3306,
    user: process.env.db_username,
    password: process.env.db_password,
    database: "bamazon",
});

connection.connect();

function display() {
    connection.query("SELECT * FROM products", function(error, results) {

        if (error) throw error;
        console.log("---------------------------------");
        console.log("       Welcome to Bamazon       ");
        console.log("---------------------------------");
        console.log("");
        console.log("Find your products below");
        console.log("");

    var table = new Table({
        head: ["Product Id", "Product Description", "Department", "Cost"],
        colWidths: [12, 50, 20, 8],
        colAligns: ["center", "left", "left", "right"],
        style: {
            head: ["aqua"],
            compact: true
        }
    });

    for (var i = 0; i < results.length; i++){
        table.push ([results[i].item_id, results[i].product_name, results[i].department_name, results[i].price]);
    }
    console.log(table.toString());
    console.log("");
    shopping();
    });
};

var shopping = function() {
    inquirer
      .prompt({
        name: "buyProduct1",
        type: "input",
        message: "What product Id are you looking for?"
      })
      .then(function(answer1) {
        var selection = answer1.buyProduct1;
        connection.query("SELECT * FROM products WHERE Id=?", selection, function(
          error,
          results
        ) {
          if (error) throw error;
          if (results.length === 0) {
            console.log(
              "The product you have selected is no longer available. Try another Id"
            );
  
            shopping();
          } else {
            inquirer
              .prompt({
                name: "buyQuantity",
                type: "input",
                message: "How many would you like?"
              })
              .then(function(answer2) {
                var buyQuantity = answer2.buyQuantity;
                if (buyQuantity > results[0].stock_quantity) {
                  console.log("Sorry we have " + results[0].stock_quantity + " in stock");

                  shopping();
                } else {
                  console.log("");
                  console.log(results[0].product_name + " purchased");
                  console.log(buyQuantity + " qty @ $" + results[0].price);
  
                  var newQuantity = results[0].stock_quantity - quantity;
                  connection.query(
                    "UPDATE product SET stock_quantity = " +
                      newQuantity +
                      " WHERE item_id = " +
                      results[0].item_id,
                    function(error, resultsUpdate) {
                      if (error) throw error;
                      console.log("");
                      console.log("Your Order has been Processed");
                      console.log("");
                      connection.end();
                    }
                  );
                }
              });
          }
        });
      });
  };


display();



// connection.connect(function(err) {
//     if (err) throw err;
//     console.log('connected as id ' + connection.threadId);
//   });
  
//   display();
  
//   function display() {
//     connection.query('SELECT * FROM products', function(err, res) {
//       if (err) throw err;
//       dataArr = res.length;
//       console.log(dataArr);
//       info = res;
//       console.log(info);
//       console.log('---------------------------------');
//       console.log('       Welcome to Bamazon       ');
//       console.log('---------------------------------');
//       console.log('');
//       console.log('Find your products below');
//       console.log('');
  
//       gettingInfo();
//     });
//   }
  
//   function gettingInfo() {
//     for (var i = 0; i < dataArr; i++) {
      
//           table.push([
//             info[i].item_id,
//             info[i].product_name,
//             info[i].department_name,
//             info[i].price
//           ]);
//         }
//         console.log(table.toString());
//         console.log('');
//       }
   
  
//   var table = new Table({
//     head: ['Product Id', 'Product Description', 'Department', 'Cost'],
//     colWidths: [12, 50, 20, 8],
//     colAligns: ['center', 'left', 'left', 'right'],
//     style: {
//       head: ['aqua'],
//       compact: true
//     }
//   });