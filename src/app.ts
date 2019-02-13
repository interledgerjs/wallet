import * as bodyParser      from "body-parser";
import * as express         from "express";
import * as dbController    from "./controllers/dbController";
import * as exchange        from "./controllers/exchangeController";
import * as jwtController   from "./controllers/jwtcontroller";
import * as transaction     from "./controllers/transaction"; 
import * as wallet          from "./controllers/wallet";
import * as middleware      from "./middleware";
import * as status          from "./controllers/status";

const app = express();
app.set("port", 3000);
app.use(bodyParser.json());

app.get("/initialise", dbController.initialise);
app.get("/drop", dbController.drop);

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

//add ACCOUNTS block
app.get ('/accounts/owner_user_id/:owner_user_id', status.get_acc_by_owner_user_id); 
app.get ('/accounts/account_id/:account_id', status.get_acc_by_account_id);
app.post('/accounts', status.create_new_acc);
app.put ('/accounts', status.update_acc); //json fields: account_id, amount

//add USERS block

app.get("/getToken", jwtController.genToken);

app.get("/exchange", exchange.getRates);

app.listen(app.get("port"), () => {
    console.log("server running on port %d", app.get("port"));
});