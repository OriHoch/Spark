const login = require("../../libs/passport").login;
const api = require("./api.js");


module.exports = (app, passport) => {

    app.post("/api/users/login", (req, res) => {
        api.users.login(null, req.body).then((json) => {res.json(json)});
    })

};
