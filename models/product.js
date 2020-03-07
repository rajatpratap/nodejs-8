const fs = require("fs");
const path = require("path");
const Cart = require("./cart");

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
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  /* 
  Note: Every `this.XXXXXXX` in constructor and in save() will be amalgamated as 
        an object with XXXXXXX as an attribute in it. e.g: {XXXXXXX: value}
  */

  save() {
    getProductFromFiles(products => {
      /* products is the input from UPDATE/CREATE form */
      if (this.id) {
        /* check for an update */
        const existingProductIndex = products.findIndex(
          prod => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          console.log("##error", err);
        });
      } else {
        /* check for create */
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log("##error", err);
        });
      }
    });
  }

  static deleteById(id) {
    getProductFromFiles(products => {
      const product = products.find(prod => prod.id === id);
      const updatedProducts = products.filter(prod => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(cb) {
    getProductFromFiles(cb);
  }

  static findById(id, cb) {
    getProductFromFiles(products => {
      const product = products.find(p => p.id === id);
      cb(product); /* cb() will be triggered for product-searched */
    });
  }
};
