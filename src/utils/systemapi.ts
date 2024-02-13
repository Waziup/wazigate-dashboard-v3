// This is how to run it on your PC
// chromium-browser --disable-web-security --user-data-dir="./tmp"

// const URL = "http://10.42.0.33:5000/";
const URL = "/apps/waziup.wazigate-system/ui/";

async function failResp(resp: Response) {
  const text = await resp.text();
  throw `There was an error calling the API.\nThe server returned (${resp.status}) ${resp.statusText}.\n\n${text}`;
}

/*--------------*/

export async function internet() {
    /*	console.log("Call internet");
        return await fetch(URL + "internet")
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw "Something went wrong";
                    // throw new Error("Something went wrong");
                }
            })
            .then(responseJson => {
                // Do something with the response
                return responseJson;
            })
            .catch(error => {
                console.log(error);
            });

            */
    const resp = await fetch(URL + "internet");
    if (!resp.ok) await failResp(resp);
    return await resp.json();
}
/*--------------*/

export async function getTime() {
    const resp = await fetch(URL + "time");
    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

/*-------------- */

export async function getTimezones() {
  const resp = await fetch(URL + "timezones");
  if (!resp.ok) await failResp(resp);
  return await resp.json();
}

export async function getTimezone() {
  const resp = await fetch(URL + "timezone");
  if (!resp.ok) await failResp(resp);
  return await resp.json();
}

export async function getTimezoneAuto() {
  const resp = await fetch(URL + "timezone/auto");
  if (!resp.ok) await failResp(resp);
  return await resp.json();
}

export async function setTimezone(data: string) {
  const resp = await fetch(URL + "timezone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!resp.ok) await failResp(resp);
  return await resp.text();
  // return await resp.json();
}

/*-------------- */

// export type knownDevices = "wlan0" | "eth0" | string;

export type Devices = Record<string, Device>;

export async function getNetworkDevices(): Promise<Devices> {
    const resp = await fetch(URL + "net");
    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

//

export type APInfo = {
    SSID: string;
    available: boolean;
    device: string;
    ip: string;
    password: string;
};

// export async function getAPInfo(): Promise<APInfo> {
//   const resp = await fetch(URL + "net/wifi/ap");
//   if (!resp.ok) await failResp(resp);
//   return await resp.json();
// }

export type AccessPointRequest = {
    ssid?: string,
    password?: string
}

export async function setAPInfo(r: AccessPointRequest) {
    const resp = await fetch(URL + "net/wifi/ap", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(r),
    });
    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

//

export async function setAPMode() {
    const resp = await fetch(URL + "net/wifi/mode/ap", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    //   console.log(resp);
    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

//

export type AccessPoint = {
    ssid: string;
    freq: number,
    strength: number,
    flags: number,
    hwAddress: string,
    maxBitrate: number,
    mode: number,
    rsnFlags: number,
    wpaFlags: number,
};

export async function getWiFiScan(): Promise<AccessPoint[]> {
    const resp = await fetch(URL + "net/wifi/scan");
    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

export type WifiReq = {
    ssid: string,
    autoConnect: boolean,
    password?: string,
}

export async function setWiFiConnect(r: WifiReq) {
    const resp = await fetch(URL + "net/wifi", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(r),
    });
    if (!resp.ok) await failResp(resp);
}

export async function removeWifi(ssid: string) {
    const resp = await fetch(URL + "net/wifi", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ssid}),
    });
    if (!resp.ok) await failResp(resp);
}

//

type IP4AddressData = {
    Address: string,
    Prefix: number
}

type IP4RouteData = {
    Destination: string,
    Prefix: number,
    NextHop: string,
    Metric: number,
    AdditionalAttributes: Record<string, string>
}

type IP4NameserverData = {
  Address: string
}

type Connection = {
    "802-11-wireless"?: {
        ssid: string,
    },
    connection: {
        id: string,
        uuid: string,
        type: string,
    }
}

export type Device = {
    Interface: string,
    "IP interface": string,
    State: string,
    IP4Config: {
        Addresses: IP4AddressData[], 
        Routes: IP4RouteData[]
        Nameservers: IP4NameserverData[]
        Domains: string[],
    },
    AvailableConnections: Connection[],
    stateReason?: string ,
    ActiveConnectionId?: string,
    ActiveConnectionUUID?: string,
}

export async function getWlanDevice(): Promise<Device> {
    const resp = await fetch(URL + "net/wifi");
    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

//

export type UsageInfo = {
  cpu_usage: string;
  disk: {
    available: string;
    device: string;
    mountpoint: string;
    percent: string;
    size: string;
    used: string;
  };
  mem_usage: {
    total: string;
    used: string;
  };
  temp: string;
};

export async function getUsageInfo(): Promise<UsageInfo> {
    const resp = await fetch(URL + "usage");
    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

//

export type cInfo = {
  Id: string;
  Names: string[];
  State: string;
  Status: string;
  Image: string;
};

export async function getAllContainers(): Promise<cInfo[]> {
    const resp = await fetch(URL + "docker");
    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

export async function getContainer(id: string): Promise<cInfo> {
    const all = await getAllContainers();
    const container = all.find(c => c.Id == id);
    if (!container) throw "Container not found";
    return container;
}

export async function setContainerAction(id: string, action: string) {
    const resp = await fetch(URL + "docker/" + id + "/" + action, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!resp.ok) await failResp(resp);
    return await resp.text();
    // return await resp.json();
}

export async function getContainerLogs(id: string, tail: number) {
    const resp = await fetch(URL + "docker/" + id + "/logs/" + tail.toString());

    if (!resp.ok) await failResp(resp);
    return await resp.text();
}

export async function dlContainerLogs(id: string) {
    const resp = await fetch(URL + "docker/" + id + "/logs");

    if (!resp.ok) await failResp(resp);
    return resp;
}

//

export async function doUpdate() {
  const resp = await fetch(URL + "update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!resp.ok) await failResp(resp);
  return await resp.json();
}

export async function getUpdateStatus() {
  const resp = await fetch(URL + "update/status");

  if (!resp.ok) await failResp(resp);
  return await resp.json();
}

export async function getVersion() {
  const resp = await fetch("/version");

  if (!resp.ok) await failResp(resp);
  return await resp.text();
}

export async function getBuildNr() {
    const resp = await fetch("/buildnr");

    if (!resp.ok) await failResp(resp);
    return await resp.text();
}

//

export async function getAllSensors() {
    const resp = await fetch(URL + "sensors");

    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

export async function getSensorValue(name: string) {
    const resp = await fetch(URL + "sensors/" + name);

    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

//

export async function getBlackout() {
    const resp = await fetch(URL + "blackout");

    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

//

export async function getConf() {
    const resp = await fetch(URL + "conf");

    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

export async function setConf(data: string) {
  const resp = await fetch(URL + "conf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!resp.ok) await failResp(resp);
  return await resp.text();
  // return await resp.json();
}

export async function setTime(data: string) {
  const resp = await fetch(URL + "time", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!resp.ok) await failResp(resp);
  return await resp.text();
  // return await resp.json();
}

//

export async function shutdown() {
  const resp = await fetch(URL + "shutdown", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!resp.ok) await failResp(resp);
  return await resp.text();
  // return await resp.json();
}

export async function reboot() {
  const resp = await fetch(URL + "reboot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!resp.ok) await failResp(resp);
  return await resp.text();
  // return await resp.json();
}



//
