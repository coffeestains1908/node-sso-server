# node-sso-server (node + mongo + jwt)
For fun

## ENVIRONMENT VARIABLES
- DB_USERNAME
- DB_PWD
- DB_NAME
- PORT(optional)

# Endpoints
## Verify
Used to verify request header authorization header.

<b>URL</b>: `/verify (GET)`

#### Success Response
<b>Code</b> `200 OK`

<hr>
## Authenticate
Used to authenticate user, compare username and password against database.

<b>URL</b>: `/authenticate (POST)`

#### Success Response
<b>Code</b>: `200 OK`

<b>Content Example</b>
```
{
  "accessToken": "<jwt token>"
}
```

## Register

Used to verify request header authorization header

<b>URL</b>: `/account/register (POST)`

#### Success Response
<b>Code</b> `200 OK`

<b>Content Example</b>
```
{
  "username": "<username>",
  "password": "<password>",
  "confirmPassword": "<password>"
}
```

<b>Content Example</b>
```
{
  "username": "<username>",
  "password": "<hashed password>",
  "createdAt": "2020-08-28T09:38:38.517Z",
  "_id": "<mongo object id>"
}
```


#### Error Response

<b>Code</b> `400 Bad Request`

<b>Content Example</b>
```
{
  "errors": [
    {
      "value": "<value>",
      "msg": "taken",
      "param": "username",
      "location": "body"
    }
  ]
}
```
