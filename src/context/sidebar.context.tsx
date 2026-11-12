import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { useMediaQuery, useTheme } from "@mui/material";

interface SidebarContextValues {
  /** true when the sidebar shows the full menu, false when it is squeezed to icons */
  expanded: boolean;
  /** true when the sidebar is squeezed to icons only */
  collapsed: boolean;
  /** toggle between the full menu and the icons-only rail */
  toggle: () => void;
  /** true when the sidebar is forced to icons by the viewport (sm-md) */
  forcedCollapsed: boolean;
  /** true on small screens, where the sidebar is a drawer instead */
  isMobile: boolean;
  /** mobile drawer open state */
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

export const SidebarContext = createContext<SidebarContextValues>({
  expanded: true,
  collapsed: false,
  toggle: () => {},
  forcedCollapsed: false,
  isMobile: false,
  drawerOpen: false,
  setDrawerOpen: () => {},
});

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));
  // between sm and md (600-900px) the sidebar is always squeezed to icons
  const forcedCollapsed = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  // close the mobile drawer whenever the route changes
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const toggle = useCallback(() => {
    if (isMobile) {
      setDrawerOpen((open) => !open);
      return;
    }
    setCollapsed((c) => !c);
  }, [isMobile]);

  const expanded = !forcedCollapsed && !collapsed;

  const value = useMemo<SidebarContextValues>(
    () => ({
      expanded,
      collapsed: !expanded,
      toggle,
      forcedCollapsed,
      isMobile,
      drawerOpen,
      setDrawerOpen,
    }),
    [expanded, toggle, forcedCollapsed, isMobile, drawerOpen],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
