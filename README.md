# AssisDent web client

### Tampere University COMP.SE.610/620 spring 2023 Group G project work

## Installing
Before building or running the application, you need to have some prerequisites
installed on your system.

The project is built with [Vite](https://vitejs.dev/guide/), which requires Node.js version 14.18 or higher. It is recommended to update Node and npm to the latests versions available.

### Windows
On Windows, you can follow the [npm Docs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) to install Node and npm.

### Linux
On Debian-based systems (such as Ubuntu), you can install Node and npm with:
```
sudo apt update
sudo apt install nodejs npm
```
Both prerequisites can be installed on Fedora with:
```
sudo dnf install nodejs
```

After downloading Node and npm, the program can be installed with:
```
cd assisdent-web-client
npm install
```

## Building and running
When developing, the project can be run with:
```
npm run dev
```
To build the project into `./dist` and to preview the built application, run:
```
npm run build
npm run preview
```

## Testing
To run tests, run:
```
npm test
```
Linter can be run with:
```
npm run lint
```

### Test reports

Running the tests produces a test report in two formats in `/reports`. 

The reports are in .xml and .html formats,
and they include same information: the amount of passing, failed and skipped tests. The reports are
generated also on a push to `main` or `development`. 

The output can be viewed in three ways:

- Locally
  - Run the tests locally and view the generated html report in `/reports` folder. This can be done by opening the html file in a browser.

- CI/CD pipeline, on a push to `main` or `development`.
  1. Under a CI/CD run job *JEST Tests* in the Actions tab.
  2. Download report in pdf format (generated from the html report) from the workflow artifacts. The artifacts can be found under a specific Github Actions workflow run page, in the section *Artifacts*.

### Writing a test

A new (unit or integration) test can be added by creating a new file under
`/src/test`. Jest and React Testing Library functionality can be utilized.
When running the tests, Jest will look for files ending in `.test.tsx` in
the test directory.

## Configuration
Environment variables are stored in `.env`. Change the values to match
the development environment there.
```
VITE_ASSISCARE_USER         username for AssisCare authentication
VITE_ASSISCARE_PASS         password for AssisCare authentication
VITE_ASSISCARE_BASE         base URL of the AssisCare REST API
VITE_ASSISCARE_ROUTE        URI path to project course endpoint
```
