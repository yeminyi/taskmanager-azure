# Multi-User Task Manager System

Demo runs here : [https://yeminyi.github.io/task-manager/](https://yeminyi.github.io/task-manager/)

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
