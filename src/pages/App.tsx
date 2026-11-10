import { Box, Breadcrumbs, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { withBasePath } from "../constants";
import PageHeader from "../components/layout/PageHeader";

// The app is rendered from this path (e.g. /apps/waziup.wazigate-system or
// /apps/waziup.wazigate-system/net/wifi). It is routed to the gateway as is,
// with the sub-path the dashboard is served from in front of it.
//
// The trailing slash is kept on purpose: the gateway strips /apps/<id> and
// forwards the rest to the app, so /apps/<id>/docs must reach the app as
// "docs/" - without the slash the app answers 502 ("This app is not running").
export default function AppUI() {
  const { pathname, search, hash, state } = useLocation();
  const src = pathname + search + hash;
  // the app name is passed as navigation state when opening the app
  const appName = (state as { title?: string } | null)?.title || "Apps";
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <PageHeader
        title={appName}
        breadcrumbs={
          <Breadcrumbs aria-label="breadcrumb">
            <Typography
              fontSize={16}
              sx={{ ":hover": { textDecoration: "underline" } }}
              color="text.primary"
            >
              <Link
                style={{
                  color: "black",
                  textDecoration: "none",
                  fontWeight: 300,
                }}
                state={{ title: "Devices" }}
                color="inherit"
                to="/"
              >
                Home
              </Link>
            </Typography>
            <Typography
              fontSize={16}
              sx={{ ":hover": { textDecoration: "underline" } }}
              color="text.primary"
            >
              <Link
                style={{
                  color: "black",
                  textDecoration: "none",
                  fontWeight: 300,
                }}
                state={{ title: "Apps" }}
                color="inherit"
                to="/apps"
              >
                Apps
              </Link>
            </Typography>
            <Typography
              style={{
                color: "black",
                textDecoration: "none",
                fontWeight: 300,
              }}
              color="text.primary"
            >
              {appName}
            </Typography>
          </Breadcrumbs>
        }
      />
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <iframe
          src={withBasePath(src)}
          title="Apps"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        ></iframe>
      </Box>
    </Box>
  );
}
