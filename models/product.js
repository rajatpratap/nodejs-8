const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

/* 

Here reading of file is performed using 
getProductFromFiles() twice:

1- When it reads on landing the page 
2- After writing into file following redirecting
   to shop page where again reading is performed.

*/

const getProductFromFiles = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductFromFiles(products => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductFromFiles(cb);
  }

  static findById(id, cb) {
    getProductFromFiles(products=>{
      const product = products.find(p=>p.id === id);
      cb(product) /* cb() will be triggered for product-searched */
    });
  }

};
