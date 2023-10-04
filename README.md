# Voice assistant for type 2 diabetes mellitus treatments

---

## Medical Interface

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) v15.2.9. It uses models from [FHIR R5](http://hl7.org/fhir/).

The project is based on [Akveo's ngx-admin](https://github.com/akveo/ngx-admin), which at the same time uses [Nebular](https://github.com/akveo/nebular) components. The folder structure and theme elements were taken from ngx-admin.

Additionally, the project uses a number of open-source libraries defined in the `package.json` file.

### Requirements

Node.js v18.x and NPM 9.x. More information about system requirements can be found in [Angular CLI](https://github.com/angular/angular-cli).

The REST API service must be running and have a valid HTTP address. Add the REST API URL as an env variable in `environment.ts` and `environment.prod.ts`.

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
