# power-ui

Power.futurice.com new UI.

## Installation

Make sure you are using a recent npm version, e.g. v2.13.x.

```
npm install
```

## Running in development mode

If you work at Futurice with access to the private backend repository, follow the instructions below. Otherwise, for the general public, this repository serves only as an example of a Cycle.js frontend app.

Clone the backend repository (http://github.com/futurice/power) and follow its instructions to run it locally in your computer. By default it is expected to run at `http://localhost:8000/api/v1/`. You can configure the expected host by using BACKEND_HOST environment variable. For example: `BACKEND_HOST="http://localhost:8001"`.

To continuously compile and lint:
```
npm run watch
```

Then open your browser at `localhost:8080`.

Before committing a new change, run the tests with
```
npm run test
```

[![Build Status](https://travis-ci.org/futurice/power-ui.svg?branch=master)](https://travis-ci.org/futurice/power-ui)

## Deployment

- Access `comedius` server via SSH.
- cd to `/opt/power-ui`
- `git pull origin master` (might need to do it as sudo)
- `npm install`
- `npm run build`

```
npm run build
```

## Code Conventions

- **Capitalized functions** are Cycle.js component functions, and their lowercase counterpart is the output of calling that function. E.g. `PeoplePage` is the component function, and `peoplePage` is the output, i.e., `var peoplePage = PeoplePage(args);`. These are **not** constructors.
