import { Box, Typography } from "@mui/material";
import { Menu, MenuOpen } from "@mui/icons-material";
import { useSidebar } from "../../context/sidebar.context";

interface PageHeaderProps {
  /** the name of the page, shown next to the menu toggle */
  title: string;
  /** breadcrumbs rendered below the title, above the divider */
  breadcrumbs?: React.ReactNode;
}

// the menu icon is 20px wide (fontSize="small") plus the 8px gap to the title,
// so the breadcrumbs start at the same x as the page name, not under the icon
const ICON_OFFSET = "28px";

/**
 * The header shown at the top of every page: a menu toggle that collapses or
 * expands the sidebar, the page name, the page breadcrumbs, and a divider.
 */
export default function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  const { expanded, toggle } = useSidebar();
  return (
    <Box sx={{ flexShrink: 0, bgcolor: "#FAFBFB" }}>
      <Box sx={{ display: "flex", alignItems: "center", pl: 2, pr: 2, pt: 1, pb: 0 }}>
        <Box
          component="button"
          onClick={toggle}
          title={expanded ? "Hide menu" : "Show menu"}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            border: "none",
            background: "none",
            p: 0.5,
            borderRadius: 1,
            cursor: "pointer",
            font: "inherit",
            color: "#292F3F",
            "&:hover": { bgcolor: "#EDF0F4" },
          }}
        >
          {expanded ? <MenuOpen fontSize="small" /> : <Menu fontSize="small" />}
          <Typography fontWeight={"600"} color={"#292F3F"} noWrap>
            {title}
          </Typography>
        </Box>
      </Box>
      {breadcrumbs && (
        <Box
          sx={{
            pl: `calc(16px + 4px + ${ICON_OFFSET})`,
            pr: 2,
            mt: -0.25,
            pb: 0.75,
            // consistent, website-style breadcrumbs on every page
            "& .MuiBreadcrumbs-root": { fontSize: 12 },
            "& .MuiBreadcrumbs-separator": { mx: 0.75, fontSize: 12 },
            "& .MuiBreadcrumbs-li": { fontSize: 12, lineHeight: 1.4 },
            "& .MuiBreadcrumbs-li p, & .MuiBreadcrumbs-li span, & .MuiBreadcrumbs-li a": {
              fontSize: "12px !important",
              fontWeight: "400 !important",
              lineHeight: 1.4,
            },
            "& .MuiBreadcrumbs-li svg": { fontSize: 14 },
          }}
        >
          {breadcrumbs}
        </Box>
      )}
      <Box sx={{ borderBottom: "1px solid #E6E6E6" }} />
    </Box>
  );
}
