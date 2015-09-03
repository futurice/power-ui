# power-ui

Power.futurice.com new UI

## Installation

Make sure you are using a recent npm version, e.g. v2.13.x.

```
npm install
```

## Running in development mode

Clone the backend repository (http://github.com/futurice/power) and follow its instructions to run it locally in your computer. It is expected to run at `http://localhost:8000/api/v1/`.

To continuously compile and lint:
```
npm run watch
```

Then open your browser at `localhost:8080`.

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
