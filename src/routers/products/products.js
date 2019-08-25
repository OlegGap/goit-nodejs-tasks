const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const url = require('url');


const ProductsRouter = (request, response) => {

    const parsedUrl = url.parse(request.url);

    const urlArray = parsedUrl.path.split('/');
    const filePath = path.join(__dirname, '../../db/products/all-products.json');
    const allFile = JSON.parse(fs.readFileSync(filePath));
    let resultFile = [];

    if (parsedUrl.query !== null) {//returned cllection of products by id`s
        const urlQueryObject = (querystring.parse(parsedUrl.query));
        if (urlQueryObject.ids !== undefined) {
            const idArray = urlQueryObject.ids.slice(1, -1).split(',');
            resultFile = allFile.filter(product => idArray.find(elementID => {
                return elementID == product.id;
            }));
        } else if (urlQueryObject.category !== undefined) {
            const categoryArray = urlQueryObject.category.slice(1, -1).split(',');
            resultFile = allFile.filter(product =>
                categoryArray.find(elementCategory =>
                    product.categories.find(category =>
                        elementCategory == category)
                ));
        } else {
            response.writeHead(400, {
                'Content-Type': 'application/json',
            });
            response.end(JSON.stringify({ 'status': 'failed', 'product': [] }));
        }
    } else if (urlArray[2] !== undefined) {//returned one product by id
        resultFile = [];
        resultFile.push(allFile.find(product => product.id == urlArray[2]));
    } else {
        resultFile = allFile;//returned all products
    }

    if (resultFile.length !== 0 && resultFile[0] !== undefined) {
        resultFile = {
            "status": "success",
            "products": resultFile
        }
    } else {
        resultFile = {
            "status": "no products",
            "products": []
        }
    }

    response.writeHead(200, {
        'Content-Type': 'application/json',
    });
    response.end(JSON.stringify(resultFile));
};

module.exports = ProductsRouter;