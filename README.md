# Virtual Storytelling Project

A VR storytelling app for young people.

> Note that this is the _prototype_ for the wider VSAT project.

## Running

### What You'll Need

- [Docker](https://www.docker.com/get-started)
- [Yarn](https://yarnpkg.com/getting-started)

```
$ export NODE_ENV=localhost
```

You'll also need to export the following environment variables;
the values can be retrieved
[from the Heroku Config Vars](https://dashboard.heroku.com/apps/ancient-sierra-54813/settings).

```
$ export CLOUDINARY_URL=
$ export MAGIC_SECRET_KEY=
```

> If you're on Windows use `set ENV_VAR_NAME=VALUE`;
> see [this guide](https://www.hows.tech/2019/03/how-to-set-environment-variables-in-windows-10.html).

```shell
$ cd packages/frontend
$ yarn install
$ cd ../backend
$ yarn install
$ docker-compose up -d
$ cd ../../
$ yarn dev
```

View the (frontend) web app in your browser at
[http://localhost:3000](http://localhost:3000).

> The (backend) server app is also running at
> [http://localhost:5000](http://localhost:5000).
>
> Use this URL to verify that the backend is running:
>
> http://localhost:5000/ping

## Swapping The Proxy

`yarn dev` will start both the frontend and backend servers.

If you don't want to run the backend locally — you have an active
Internet connection — you can change the proxy the frontend
communicates with to the one running in the cloud.

Open `setupProxy` and edit the value of the `backend variable
to point to the deployed app running on Heroku:

```
const backend = 'https://ancient-sierra-54813.herokuapp.com/';
```

You can then run _just_ the frontend app like so:

```shell
$ cd packages/frontend
$ yarn start
```

## Deploying To Heroku

The deployment process [is documented here](https://devcenter.heroku.com/articles/git),
but currently you'll need an admin's Heroku credentials to deploy.

```shell
$ git push heroku develop:master
```
