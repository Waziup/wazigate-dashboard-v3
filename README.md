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

Development
===========

You can develop on the dashboard locally on your PC, linking it to a remote WaziGate.
Run it like this:
```
export VITE_WAZIGATE_API_URL=http://wazigate-dashboard-stable.staging.waziup.io
npm run dev
```

Then, you need to open the interface inyou browser, without CORS protections.
With Chrome, you can run it like that:
```
google-chrome --disable-site-isolation-trials --disable-web-security --user-data-dir="~/tmp"
```
Or install a plugin to remove CORS protections.


