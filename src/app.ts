import * as bodyParser      from "body-parser";
import * as express         from "express";
import * as accounts        from "./controllers/accounts";
import * as exchange        from "./controllers/exchangeController";
import * as jwtController   from "./controllers/jwtcontroller";
import * as transactions    from "./controllers/transactions"; 
import * as users           from "./controllers/users";
import * as wallet          from "./controllers/wallet";
import * as dbFunctions     from "./db";
import * as middleware      from "./middleware";

const app = express();
app.set("port", 3000);
app.use(bodyParser.json());

dbFunctions.initialise();

app.get("/getToken", jwtController.genToken);

//users table description: user_id, user_name, date_created, active
//USERS ENDPOINTS ARE UNTESTED
app.get ('/users/:user_id', users.get_user_by_user_id);
app.get ('/users/:user_name', users.get_user_by_user_name);
app.post('/users/:user_name', users.create_new_user);
app.put ('/users/:user_id/status', users.deactivate_status_of_user_id); //is this route name ok? refer to staff

app.get ('/accounts/:owner_user_id', accounts.get_accs_by_owner_user_id); 
app.get ('/accounts/:account_id', accounts.get_acc_by_account_id);
app.post('/accounts', accounts.create_new_acc);
app.put ('/accounts', accounts.update_acc); //json fields: account_id, amount

app.get("/transactions", transactions.transactions);
app.get("/transaction/:id/", transactions.getTransaction);
app.post("/transactions", middleware.verifyToken, transactions.addTransaction);
app.put("/transactions/:id/:execute*?", middleware.verifyToken, transactions.updateTransaction); //this will be refined at a later stage

app.get("/exchange", exchange.getRates);

app.listen(app.get("port"), () => {
    console.log("server running on port %d", app.get("port"));
});