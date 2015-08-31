# power-ui

Power.futurice.com new UI

## Installation

Make sure you are using a recent npm version, e.g. v2.13.x.

```
npm install
```

## Running in development mode

To continuously compile and lint:
```
npm watch
```

Also run a simple server to serve the files in dist:
```
python -m SimpleHTTPServer 4000
```

## Code Conventions

- **Capitalized functions** are Cycle.js component functions, and their lowercase counterpart is the output of calling that function. E.g. `PeoplePage` is the component function, and `peoplePage` is the output, i.e., `var peoplePage = PeoplePage(args);`.
