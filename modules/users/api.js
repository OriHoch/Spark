const login = require("../../libs/passport").login;
const jwt = require('jsonwebtoken');
const config = require("config");


let api_login = (request, data) => {
    let username = data.username;
    let password = data.password;
    let token = data.token;
    return new Promise((resolve) => {
        if (token) {
            let jwt_payload = jwt.verify(token, config.get("jwt_secret"));
            resolve({"ok": true, "msg": jwt_payload});
        } else {
            login(username, password, function (user, error) {
                if (user) {
                    let now = Math.floor((new Date()).getTime() / 1000);
                    let refresh = now + config.get("jwt_refresh_interval");
                    let expiry = now + config.get("jwt_expiry_interval");
                    let user_data = {
                        // details about the user which the user itself is allowed to see
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "roles": user.roles
                    };
                    let jwt_payload = {
                        "now": now,  // current time on Spark server (in seconds since unix epoch)
                        "refresh": refresh,  // when token needs to be refreshed (can be ignored in many cases)
                        "user": user_data // user details - these are details the user itself is allowed to see
                    };
                    let token = jwt.sign(jwt_payload, config.get("jwt_secret"), {
                        // the jwt exp attribute - is the maximum time token is valid, after which user needs to re-login
                        expiresIn: config.get("jwt_expiry_interval")
                    });
                    resolve({
                        "ok": true,
                        "msg": "logged-in successfully",
                        "token": token,
                        "now": now,
                        "refresh": refresh,
                        "expiry": expiry,
                        "user": user_data
                    });
                } else {
                    resolve({
                        "ok": false,
                        "msg": error
                    });
                }
            });
        }
    })
};


module.exports = {

    "login": (request, data) => {
        return new Promise((resolve) => {
            if (data.token) {
                let jwt_payload = jwt.verify(data.token, config.get("jwt_secret"));
                resolve({"ok": true, "msg": jwt_payload});
            } else {
                let username = data.username;
                let password = data.password;
                login(username, password, function (user, error) {
                    if (user) {
                        let now = Math.floor((new Date()).getTime() / 1000);
                        let refresh = now + config.get("jwt_refresh_interval");
                        let expiry = now + config.get("jwt_expiry_interval");
                        let user_data = {
                            // details about the user which the user itself is allowed to see
                            "id": user.id,
                            "email": user.email,
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                            "roles": user.roles
                        };
                        let jwt_payload = {
                            "now": now,  // current time on Spark server (in seconds since unix epoch)
                            "refresh": refresh,  // when token needs to be refreshed (can be ignored in many cases)
                            "user": user_data // user details - these are details the user itself is allowed to see
                        };
                        let token = jwt.sign(jwt_payload, config.get("jwt_secret"), {
                            // the jwt exp attribute - is the maximum time token is valid, after which user needs to re-login
                            expiresIn: config.get("jwt_expiry_interval")
                        });
                        resolve({
                            "ok": true,
                            "msg": "logged-in successfully",
                            "token": token,
                            "now": now,
                            "refresh": refresh,
                            "expiry": expiry,
                            "user": user_data
                        });
                    } else {
                        resolve({
                            "ok": false,
                            "msg": error
                        });
                    }
                });
            }
        })
    },

    "get": (request, data) => {
        return api_get_user()
    }

};
