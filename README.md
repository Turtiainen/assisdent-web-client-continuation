# AssisDent web client

### Tampere University COMP.SE.610/620 spring 2023 Group G project work 

## Running
The program can be installed with:
```
npm install
```
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

## Configuration
Environment variables are stored in `.env`. Change the values to match
the development environment there.
```
VITE_ASSISCARE_USER         username for AssisCare authentication
VITE_ASSISCARE_PASS         password for AssisCare authentication
VITE_ASSISCARE_BASE         base URL of the AssisCare REST API
VITE_ASSISCARE_ROUTE        URI path to project course endpoint
```
