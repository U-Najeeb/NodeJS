const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = (card, el) => {
  let output = card.replace(/{%ProductName%}/g, el.productName);
  output = output.replace(/{%QUANTITY%}/g, el.quantity);
  output = output.replace(/{%IMAGE%}/g, el.image);
  output = output.replace(/{%Price%}/g, el.price);
  output = output.replace(/{%NUTRIENTS%}/g, el.nutrients);
  output = output.replace(/{%DESCRIPTION%}/g, el.description);
  output = output.replace(/{%FROM%}/g, el.from);
  output = output.replace(/{%id%}/g, el.id);
  if (!el.organic) {
    output = output.replace(/{%NON_ORGANIC%}/g, "not-organic");
  }
  return output;
};
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProducts = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync("./data/data.json", "utf-8");
const dataJSON = JSON.parse(data);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const cardsHtml = dataJSON
      .map((el) => {
        return replaceTemplate(tempCard, el);
      })
      .join("");
    const output = tempOverview.replace(`{%PRODUCTSOVERVIEW%}`, cardsHtml);
    res.end(output);
  } else if (pathname === "/products") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const product = dataJSON[query.id];
    const outputProduct = replaceTemplate(tempProducts, product);
    res.end(outputProduct);
  } else if (req.url === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end("API");
  } else {
    res.writeHead(404);
    res.end("Page not found");
  }
});
server.listen(8080, () => {
  console.log("Your Server is running on port 8080");
});
