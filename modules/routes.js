module.exports = (app, passport) => {

    require("./api/routes")(app, passport);

};
