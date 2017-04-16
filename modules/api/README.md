# Spark API
 
## Using from server-side from a trusted NodeJS Spark module

Given that - 
* You are developing a NodeJS Spark module
* Your module is under modules directory
  * for example under `Spark/modules/your_module`
* You code is either in the `routes` directory or `libs` directory under your module directory
  * for example: `Spark/modules/your_module/routes/your_module_routes.js`
* You want to use the `users` module api to get user details by id

You code will look something like this - 
```js
// require libs/api from the api module
let api = require('../../modules/api/libs/api');

// the api uses an internal api request object which is used for permissions / authentication
// you can get one from an express route function `req` parameter
app.get('/example', (req, res) => {
    let request = api.get_request(req);
});

// you can also get a mock request object (for unit tests / for cli / admin functions)
let request = api.get_mock_request({
    "roles": ["admin"]
});

// now you can make api calls, passing the request object as first parameter

// get user details by id
api.users.get(request, {"id": 666, "fields": ["name", "email", "cell_phone"]}).then((response) => {
    if (response.ok) {
        let user = response.user;
        console.log(user.name, user.email, user.cell_phone);
    } else {
        console.log("error: "+response.msg);
    }
});
```

## Using from external modules - using the HTTP / REST API

Given that - 
* You are developing an external module, using any server-side or client-side language
* In this example, it's Python, but it could also be client-side code, or any other language

```python
import requests

# first, you need to get an authentication token, you get it using the api/login method
# see the users module documentation for more details about login / tokens etc..

# make a POST request to /api/login with the username and password

login_response = requests.post("https://spark.midburn.org/api/users/login", json={
    "username": username,
    "password": password
}).json()

# api responses always contain `ok` attribute
if login_response["ok"]:
    # get the authentication token from the response
    token = login_response["token"]
    # now is the time in the current time on the Spark server (in seconds, since unix epoch)
    now = login_response["now"]
    # refresh - when to refresh the token (re-authenticate but without requiring login)
    refresh = login_response["refresh"]
    # expiry - when to consider the token as invalid and require re-login
    expiry = login_response["expiry"]
else:
    # api responses always contain a `msg` attribute
    # in case of errors it will contain the error message
    raise Exception(login_response["msg"])

# now, you can use the token to make further calls to the api
# for example - get user details by id

user_response = requests.post("https://spark.midburn.org/api/users/get", json={
    "token": token,
    "id": 666, 
    "fields": ["name", "email", "cell_phone"]
})

if user_response["ok"]:
    print(user["name"])
else:
    raise Exception(user_response["msg"])
```
