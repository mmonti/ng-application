# Identity UI 2 - Instructions

 
## Overview

This page outlines the release instructions for Identity UI 2.0.x/

### Release Details

#### Service Dependencies

Depends on:

 * Identity Service 2 (http://github.anim.dreamworks.com/PAM/identity_service2).

Dependency of:

 * Nothing

### Application Configuration

#### Deployment

When deploying to a new environment, 3 new configuration files should be created specifically for that environment.

- API Gateway host
- SSL host
- Non-SSL host

These files should be created under the configuration folders

```
./src/app/configuration/<environment-hostname>-config.json
./dist/app/configuration/<environment-hostname>-config.json
```

As an example if the new environment is called: **custom-env** we will end up having:

##### API Gateway
```
./src/app/configuration/api-custom-env.nova.mgs.com-config.json
./dist/app/configuration/api-custom-env.nova.mgs.com-config.json
```
##### SSL
```
./src/app/configuration/pam-custom-env.nova.mgs.com-config.json
./dist/app/configuration/pam-custom-env.nova.mgs.com-config.json
```
##### NON-SSL
```
./src/app/configuration/pam.custom-env.nova.mgs.com-config.json
./dist/app/configuration/pam.custom-env.nova.mgs.com-config.json
```

#### Authentication

To enable authentication (which will effectively prompt users to login), set
`authentication.authEnabled` to `true`.

To configure the host, protocol and port you need to set the following properties:

```
"server": {
  "protocol": "-- http or https -- depending on what configuration file we are setting", 
  "host": "-- the host -- depending on what configuration file we are setting",
  "port": ""
}
```

If authentication is enabled, then the app needs to know which login page to
redirect to.

There should be a common login UI deployed on each stack.
Set `auth.token.redirectUrl` to `<login-ui-url>?destinationUrl=identity`

When a token expires there is a refresh endpoint that returns a new token.
Set `auth.token.refresh` to `<server.protocol>://<server.host>/service/authn/1/token/refresh` 

To configure the UI to talk to a specific deployment of the Identity Service,
set `endpointBase` to `/service/identity/<contract-vers>/`


### Build

Identity UI was built using gulp to automate the building process. In order to build the application just run:

```
npm build
```

This task will minify/uglyfy the javascript files and copy the whole application to a `/dist` folder

Worth mentioning that we only need to run this task if we have source code changes. 

For new environment were we only need to add a configuration file, copying this file to the `./dist/app/configuration` folder will be enough.


## Related Jira Tickets

| Ticket/HASH    | Version           | Description              |
|----------------|-------------------|--------------------------|
| 1cef8d80f  	   | 2.0.0             | Added config for p-nik01 |
