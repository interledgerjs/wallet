import * as bodyParser      from "body-parser";
import * as express         from "express";
import * as exchange        from "./controllers/exchangeController";
import * as jwtController   from "./controllers/jwtcontroller";
import * as status          from "./controllers/status";
import * as transaction     from "./controllers/transaction"; 
import * as wallet          from "./controllers/wallet";
import * as dbFunctions     from "./db";
import * as middleware      from "./middleware";
import * as users           from "./controllers/users";

const app = express();
app.set("port", 3000);
app.use(bodyParser.json());

dbFunctions.initialise();

app.get("/getToken", jwtController.genToken);

//users table description: user_id, user_name, date_created, active
//USERS ENDPOINTS ARE UNTESTED
app.get ('/user/:user_id', users.get_user_by_user_id);
app.get ('/user/:user_name', users.get_user_by_user_name);
app.post('/user/:user_name', users.create_new_user);
app.put ('/user/:user_id/status', users.deactivate_status_of_user_id);

app.get ('/accounts/owner_user_id/:owner_user_id', status.get_acc_by_owner_user_id); 
app.get ('/accounts/account_id/:account_id', status.get_acc_by_account_id);
app.post('/accounts', status.create_new_acc);
app.put ('/accounts', status.update_acc); //json fields: account_id, amount

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