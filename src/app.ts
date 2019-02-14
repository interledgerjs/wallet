import * as express from "express";
import * as wallet from "./controllers/wallet";
import * as transaction from "./controllers/transaction"; 
import * as bodyParser from "body-parser";
import * as dbFunctions from "./db";
import * as jwtController from "./controllers/jwtcontroller";
import * as middleware from "./middleware";
import * as exchange from "./controllers/exchangeController";

const app = express();
app.set("port", 3000);
app.use(bodyParser.json());

dbFunctions.initialise();

app.get("/getToken", jwtController.genToken);

//add users routes

//add acounts routes

app.get("/transactions", transaction.transactions);
app.get("/transaction/:id/", transaction.getTransaction);
app.post("/transaction", middleware.verifyToken, transaction.addTransaction);
app.delete("/transaction/:id", middleware.verifyToken, transaction.delTransaction); //consider for deprecation
app.put("/transaction/:id/:execute*?", middleware.verifyToken, transaction.updateTransaction);

//cosider block for deprecation
app.get("/wallets", wallet.wallets);
app.get("/wallet/:id/:transactions*?", wallet.getWallet);
app.post("/wallet", middleware.verifyToken, wallet.addWallet);
app.delete("/wallet/:id", middleware.verifyToken, wallet.delWallet); //consider for deprecation
app.put("/wallet/:id", middleware.verifyToken, wallet.updateWallet);

app.get("/exchange", exchange.getRates);

app.listen(app.get("port"), () => {
    console.log("server running on port %d", app.get("port"));
});