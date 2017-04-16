# Spark users module

This is a core module that provides all users related services like:

* user management
* permissions
* authentication
* authorization
* sign-up
* sign-in
* forgot password
* and more..

## API methods

### POST /api/users/login

Log-in a user and get an authentication token which can be used to make API calls.

Can also be used to refresh a token 

#### login using username / password
```json
{
    "username": "",
    "password": ""
}
```
#### refresh a token
```json
{
    "token": "authentication token which is still valid but needs refresh"
}
```
#### response
```json
{
    "ok": true,
    "msg": "will contain error message if ok is false",
    "token": "valid, fresh authentication token",
    "now": 1897323, // current time on Spark server (in seconds, since unix epoch)
    "refresh": 1897600, // when to refresh the token (in Spark server time, seconds since unix epoch)
    "expiry": 1899000, // when to consider the token as invalid and require another login (in Spark server time, seconds since unix epoch)
    "user": { // details about the user which the user itself is allowed to see
        "id": 123,
        "name": "",
        "roles": ["admin"]
    }
}
```

### POST /api/users/get

Get user details

#### by id
```json
{
    "token": "a valid authentication token",
    "id": 666 // id of user to fetch details for
}
```

#### by email
```json
{
    "token": "a valid authentication token",
    "email": "test@example.com" // email of user to fetch details for
}
```

#### response
```json
{
    "ok": true,
    "msg": "will contain error message if ok is false",
    "user": { // details about the user which the authentication token is allowed to view
        "id": 123,
        "name": "",
        "roles": ["admin"]
    }
}
```
