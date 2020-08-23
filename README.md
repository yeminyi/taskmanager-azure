# Multi-User Task Manager System

Demo runs here : [https://taskmanager2020.azurewebsites.net/](https://taskmanager2020.azurewebsites.net/)

## Tech stack

- Using `@ngrx/store` for state management and `@ngrx/effects` the RxJS powered side effect model for store.
- Using `@ngrx/entity` to Reduce boilerplate for creating reducers that manage a collection of models.
- Using `@ngx-translate/core` for the internationalization
- Using `rxjs` for reactive programming.
- Using `json-server` for REST API.
- Using `@angular/flex-layout` for UI layout.
- Using `@angular/material` for the UI component.
- Using `@angular/animations` for the animations.
- Using `karma` for Unit testing.

## Tools

- Using `@angular/cli` for command-line interface
- Using `concurrently` to run multiple commands `json-server`  `ng serve`concurrently

## Getting started

1. fork the project
2. git clone projectn
3. `cd to the project folder`
4. `npm install`
5. `npm start` to start the front-end project and json-server ，then visit `http://localhost:8000`(If run at local using json-server,please change the BASE_CONFIG to `http://localhost:3002`)
6. `npm run start:ssr` start SSR version (Server Side Rendering）
7. `ng build --prod` to build
8. if deploy to Azure,need to add the Web.config to read the `en.json`. pls refer `https://docs.microsoft.com/en-us/archive/blogs/africaapps/how-to-serve-static-json-files-from-a-windows-azure-website`

## Step to step to run json-server on Azure Web App

1. Open your browser and go to App Service Editor `(https://<your-app-name>.scm.azurewebsites.net/dev/wwwroot/)`

2. Run the command in the Console (Ctrl+Shift+C)
`npm install json-server --save-dev`

3. Put all file/folder (db.json and public folder) into wwwroot folder

4. Create a server.js with the following content

```
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
server.listen(process.env.PORT, () => {
  console.log('JSON Server is running')
})
```

5. Click Run (Ctrl+F5), this will generate web.config file automatically and open your website in the browser.
