# A voice assistant for type 2 diabetes mellitus treatments

---

## Doctor's Web Interface

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.0.5.

The projects is based in [Akveo's ngx-admin](https://github.com/akveo/ngx-admin), which at the same time uses [Nebular](https://github.com/akveo/nebular) components; both under a MIT license. Parts of the folder structure and theme elements were taken from ngx-admin.

Additionally, the project uses a number of open-source libraries defined in the `package.json` file.  

A build of the project is located in the `build` folder


### Requirements

Node.js with NPM must be installed in the system. The project was developed using Node.js v14.17.3 and NPM 6.14.13. More information about system requirements can be found in [Angular CLI](https://github.com/angular/angular-cli).

The REST API service must be running and have a valid HTTP address. With this address at hand, change the `baseUrl` variable in the `RestApiService` class:

```
./src/app/@core/services/rest-api-service.ts
```

_Optional:_ To run the provided build, you may install `angular-http-server` (requires NPM)

```bash
npm install angular-http-server -g
```

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `npm run build:prod` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running the build

The easiest way to run the build is with `angular-http-server`. If installed, move to the `build` folder and execute from a terminal:

```bash
angular-http-server
```

If `angular-http-server` is not installed, there are other alternatives explained in the [documentation](https://angular.io/guide/deployment) 

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
