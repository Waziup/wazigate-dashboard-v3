# Wazigate dashboard V3

This is the application repository for the wazigate dashboard version 3, feel free to check the repository and run the development version.

## Installation

- To install and run the development version of the app, clone the repository
- use either pnpm, yarn or npm to install dependencies
- ```npm install```
- Then run the development ``npm run dev``


## Docker

To run with docker, do:
```
docker build -t wazigate_ui_v3 .
docker run -it --net=host wazigate_ui_v3
```

Then open http://localhost:5173/
