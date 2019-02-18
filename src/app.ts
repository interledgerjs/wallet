import * as express from "express";
import * as wallet from "./controllers/wallet";
import * as transaction from "./controllers/transaction"; 
import * as bodyParser from "body-parser";
import * as dbFunctions from "./db";
import * as jwtController from "./controllers/jwtcontroller";
import * as middleware from "./middleware";
import * as exchange from "./controllers/exchangeController";
import * as jwt from "jsonwebtoken";

const app = express();
app.set("port", 3000);
app.use(bodyParser.json());

dbFunctions.initialise();

app.get("/transactions", transaction.transactions);
app.get("/transaction/:id/", transaction.getTransaction);
app.post("/transaction", middleware.verifyToken, transaction.addTransaction);
app.delete("/transaction/:id", middleware.verifyToken, transaction.delTransaction);
app.put("/transaction/:id/:execute*?", middleware.verifyToken, transaction.updateTransaction);

app.get("/wallets", wallet.wallets);
app.get("/wallet/:id/:transactions*?", wallet.getWallet);
app.post("/wallet", middleware.verifyToken, wallet.addWallet);
app.delete("/wallet/:id", middleware.verifyToken, wallet.delWallet);
app.put("/wallet/:id", middleware.verifyToken, wallet.updateWallet);

app.get("/getToken", jwtController.genToken);

app.get("/exchange", exchange.getRates);

// test for tokens
app.post('/test/posts', middleware.verifyToken,(req, res) => {
    res.json({
        message: 'Post created...'
    });
});

// a prototype login function to be replaced
app.post('/login', (req, res) => {
    //mock user
    const user = {
        id: 1,
        username: 'john',
        email: 'john@foo.com'
    };
    jwt.sign({user}, 'secret',{ expiresIn: '1d' }, (err, token) => {
        console.log(`Token generated for ${user.username}`);
        
        res.json({token});
    });
});


app.listen(app.get("port"), () => {
    console.log("server running on portals %d", app.get("port"));
;});