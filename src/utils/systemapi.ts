import { WaziGateApiUrl } from '../constants/index.ts'; 

const URL = WaziGateApiUrl + "/apps/waziup.wazigate-system/";

async function failResp(resp: Response) {
  const text = await resp.text();
  throw `There was an error calling the API.\nThe server returned (${resp.status}) ${resp.statusText}.\n\n${text}`;
}

/*--------------*/

export async function internet() {
    const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "internet", {headers: {Authorization: 'Bearer ' + token}});
    if (!resp.ok) await failResp(resp);
    return await resp.json();
}
/*--------------*/

export async function getTime() {
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "time", {headers: {Authorization: 'Bearer ' + token}});
    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

/*-------------- */

export async function getTimezones() {
  const token = window.sessionStorage.getItem("token");
  const resp = await fetch(URL + "timezones", {headers: {Authorization: 'Bearer ' + token}});
  if (!resp.ok) await failResp(resp);
  return await resp.json();
}

export async function getTimezone() {
  const token = window.sessionStorage.getItem("token");
  const resp = await fetch(URL + "timezone", {headers: {Authorization: 'Bearer ' + token}});
  if (!resp.ok) await failResp(resp);
  return await resp.json();
}

export async function getTimezoneAuto() {
  const token = window.sessionStorage.getItem("token");
  const resp = await fetch(URL + "timezone/auto", {headers: {Authorization: 'Bearer ' + token}});
  if (!resp.ok) await failResp(resp);
  return await resp.json();
}

export async function setTimezone(data: string) {
  const token = window.sessionStorage.getItem("token");
  const resp = await fetch(URL + "timezone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + token
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
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "net", {headers: {Authorization: 'Bearer ' + token}});
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
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "net/wifi/ap", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token
        },
        body: JSON.stringify(r),
    });
    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

//

export async function setAPMode() {
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "net/wifi/mode/ap", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token
        },
    });
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
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "net/wifi/scan", {headers: {Authorization: 'Bearer ' + token}});
    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

export type WifiReq = {
    ssid: string,
    autoConnect: boolean,
    password?: string,
}

export async function setWiFiConnect(r: WifiReq) {
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "net/wifi", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token
        },
        body: JSON.stringify(r),
    });
    if (!resp.ok) await failResp(resp);
}

export async function removeWifi(ssid: string) {
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "net/wifi", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token
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

export type Connection = {
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
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "net/wifi", {headers: {Authorization: 'Bearer ' + token}});
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
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "usage", {headers: {Authorization: 'Bearer ' + token}});
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
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "docker", {headers: {Authorization: 'Bearer ' + token}});
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
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "docker/" + id + "/" + action, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer ' + token
        },
    });
    if (!resp.ok) await failResp(resp);
    return await resp.text();
    // return await resp.json();
}

export async function getContainerLogs(id: string, tail: number) {
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "docker/" + id + "/logs/" + tail.toString(), {headers: {Authorization: 'Bearer ' + token}});

    if (!resp.ok) await failResp(resp);
    return await resp.text();
}

export async function dlContainerLogs(id: string) {
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "docker/" + id + "/logs", {headers: {Authorization: 'Bearer ' + token}});

    if (!resp.ok) await failResp(resp);
    return resp;
}

//

export async function doUpdate() {
  const token = window.sessionStorage.getItem("token");
  const resp = await fetch(URL + "update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + token
    },
  });
  if (!resp.ok) await failResp(resp);
  return await resp.json();
}

export async function getUpdateStatus() {
  const token = window.sessionStorage.getItem("token");
  const resp = await fetch(URL + "update/status", {headers: {Authorization: 'Bearer ' + token}});

  if (!resp.ok) await failResp(resp);
  return await resp.json();
}

export async function getVersion() {
  const token = window.sessionStorage.getItem("token");
  const resp = await fetch(URL + "version", {headers: {Authorization: 'Bearer ' + token}});

  if (!resp.ok) await failResp(resp);
  return await resp.text();
}

export async function getBuildNr() {
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "buildnr", {headers: {Authorization: 'Bearer ' + token}});

    if (!resp.ok) await failResp(resp);
    return await resp.text();
}

//

export async function getAllSensors() {
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "sensors", {headers: {Authorization: 'Bearer ' + token}});

    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

export async function getSensorValue(name: string) {
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "sensors/" + name, {headers: {Authorization: 'Bearer ' + token}});

    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

//

export async function getBlackout() {
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "blackout", {headers: {Authorization: 'Bearer ' + token}});

    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

//

export async function getConf() {
  const token = window.sessionStorage.getItem("token");
    const resp = await fetch(URL + "conf", {headers: {Authorization: 'Bearer ' + token}});

    if (!resp.ok) await failResp(resp);
    return await resp.json();
}

export async function setConf(data: { fan_trigger_temp:number,oled_halt_timeout:number }) {
  const token = window.sessionStorage.getItem("token");
  const resp = await fetch(URL + "conf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + token
    },
    body: JSON.stringify(data),
  });
  if (!resp.ok) await failResp(resp);
  return await resp.text();
  // return await resp.json();
}

export async function setTime(data: string) {
  const token = window.sessionStorage.getItem("token");
  const resp = await fetch(URL + "time", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + token
    },
    body: JSON.stringify(data),
  });
  if (!resp.ok) await failResp(resp);
  return await resp.text();
  // return await resp.json();
}

//

export async function shutdown() {
  const token = window.sessionStorage.getItem("token");
  const resp = await fetch(URL + "shutdown", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + token
    },
  });
  if (!resp.ok) await failResp(resp);
  return await resp.text();
  // return await resp.json();
}

export async function reboot() {
  const token = window.sessionStorage.getItem("token");
  const resp = await fetch(URL + "reboot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 'Bearer ' + token
    },
  });
  if (!resp.ok) await failResp(resp);
  return await resp.text();
  // return await resp.json();
}



//
