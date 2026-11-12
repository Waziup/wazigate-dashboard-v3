export const DEFAULT_COLORS = {
  primary_blue: "#3693c4",
  primary_blue_light: "#e5f6fd",
  orange: "#F35E19",
  red: "#FF0000",
  primary_black: "#000",
  secondary_black: "#000000",
  third_dark: "#325460",
  secondary_gray: "#D5D6D8",
  navbar_dark: "#292F3F",
};
export const WaziGateApiUrl = import.meta.env.VITE_WAZIGATE_API_URL || ".";

// set WaziGateApiUrl to localhost when running with a local wazigate-edge server
//export const WaziGateApiUrl='http://localhost'

// The dashboard might be served through a sub-path, e.g. https://vpn.waziup.org/gateway-b827eba987e8df8f/.
// The APIs use relative URLs, so they already follow the sub-path of the page; only URLs
// that have to be absolute (iframes, docs, downloads) need this prefix.
const BASE_PATH = window.location.pathname.replace(/\/(index\.html)?$/, "");

/**
 * Prefixes an absolute path with the path the dashboard is served from.
 * Absolute URLs are returned untouched.
 */
export const withBasePath = (path: string) => {
  if (/^([a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path;
  return (BASE_PATH + "/" + path).replace(/\/{2,}/g, "/");
};
