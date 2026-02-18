import { Menu, X, ChevronRight, PanelLeftClose, PanelLeft } from "lucide-react";
import React, { useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePermissions, useAuth } from "@/hooks";
import { ThemeToggle } from "@/components";
import PasswordChangeModal from "@/pages/password/PasswordChangeModal";
import ProfileEditModal from "@/pages/profile/ProfileEditModal";
import UserMenu from "./UserMenu";
import {
  useGenericNavigationFunctions,
  env,
  cn,
  isNavigationActive,
} from "@/utils";
import { getNavigationByPermissions, TEST_IDS } from "@/config";
import { ROLE_NAMES as ROLE_KEYS } from "@/config/generated/permissionKeys.generated";
import styles from "./Layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
  const { user, logout } = useAuth();
  const { hasPermission, hasRole } = usePermissions();
  const location = useLocation();
  const nav = useGenericNavigationFunctions();

  const isAdmin = useMemo(
    () =>
      (user?.role?.name || "").toLowerCase() ===
      ROLE_KEYS.ADMINISTRATOR.toLowerCase(),
    [user?.role?.name]
  );

  const isDevelopment = useMemo(() => {
    const envName = (env.VITE_ENVIRONMENT || "").toString().toLowerCase();
    return envName === "development" || envName === "local";
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    nav.goToLogin();
  }, [logout, nav]);

  const { mainNavigation, footerNavigation } = useMemo(() => {
    const allNavItems = getNavigationByPermissions(hasPermission, hasRole, {
      isAdmin,
      isDevelopment,
    });
    return {
      mainNavigation: allNavItems.filter((n) => (n.position ?? "main") === "main"),
      footerNavigation: allNavItems.filter((n) => n.position === "footer"),
    };
  }, [hasPermission, hasRole, isAdmin, isDevelopment]);

  const isCurrentPath = useCallback(
    (path: string) => isNavigationActive(location.pathname, path),
    [location.pathname]
  );

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const toggleSidebarCollapsed = useCallback(
    () => setSidebarCollapsed((prev) => !prev),
    []
  );
  const openProfileModal = useCallback(() => setShowProfileModal(true), []);
  const closeProfileModal = useCallback(() => setShowProfileModal(false), []);
  const openPasswordModal = useCallback(() => setShowPasswordModal(true), []);
  const closePasswordModal = useCallback(() => setShowPasswordModal(false), []);

  const renderNavigationItem = useCallback((item: any, isMobile = false) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isSubmenuOpen =
      openSubmenus.has(item.id) ||
      (hasChildren &&
        item.children.some((child: any) => isCurrentPath(child.href)));
    const isActive =
      isCurrentPath(item.href) ||
      (hasChildren &&
        item.children.some((child: any) => isCurrentPath(child.href)));

    if (hasChildren) {
      return (
        <div key={item.id} className={styles.navItemContainer}>
          <button
            onClick={() => {
              setOpenSubmenus(new Set([item.id]));
              const firstChild = item.children?.[0];
              if (firstChild?.href) {
                nav.goTo(firstChild.href);
                if (isMobile) setSidebarOpen(false);
              }
            }}
            className={cn(
              styles.navLink,
              styles.navItemWithSubmenu,
              isActive && styles.navLinkActive
            )}
            data-testid={item.testId}
          >
            <div className={styles.navItemContent}>
              <Icon className={styles.navIcon} />
              {item.name}
            </div>
            <ChevronRight
              className={cn(
                styles.submenuToggle,
                isSubmenuOpen && styles.submenuToggleOpen
              )}
              size={16}
            />
          </button>
          <div
            className={cn(
              styles.submenu,
              isSubmenuOpen ? styles.submenuOpen : styles.submenuClosed
            )}
          >
            {item.children
              .filter((child: any) => {
                if (child.permission && hasPermission(child.permission))
                  return true;
                if (child.roles && hasRole(child.roles)) return true;
                if (!child.permission && !child.roles) return true;
                return false;
              })
              .map((child: any) => {
                const ChildIcon = child.icon;
                const isChildActive = isCurrentPath(child.href);
                return (
                  <Link
                    key={child.id}
                    to={child.href}
                    className={cn(
                      styles.submenuLink,
                      isChildActive && styles.submenuLinkActive
                    )}
                    onClick={() => {
                      if (isMobile) setSidebarOpen(false);
                    }}
                    data-testid={child.testId}
                  >
                    <ChildIcon className={styles.navIcon} />
                    {child.name}
                  </Link>
                );
              })}
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.href}
        className={cn(styles.navLink, isActive && styles.navLinkActive)}
        onClick={() => {
          if (isMobile) setSidebarOpen(false);
          setOpenSubmenus(new Set());
        }}
        data-testid={item.testId}
      >
        <Icon className={styles.navIcon} />
        {item.name}
      </Link>
    );
  }, [isCurrentPath, hasPermission, hasRole, nav, openSubmenus]);

  return (
    <div className={styles.container} data-testid={TEST_IDS.LAYOUT_CONTAINER}>
      <div
        className={cn(
          styles.mobileSidebarOverlay,
          sidebarOpen ? styles.mobileSidebarVisible : styles.mobileSidebarHidden
        )}
        data-testid={TEST_IDS.MOBILE_SIDEBAR}
      >
        <div
          className={styles.sidebarOverlay}
          onClick={closeSidebar}
        />
        <div className={styles.sidebar}>
          <div className={styles.desktopHeader}>
            <h1 className={styles.sidebarTitle}>Template</h1>
            <button
              onClick={closeSidebar}
              className={styles.actionBtn}
              data-testid={TEST_IDS.MOBILE_SIDEBAR_CLOSE}
            >
              <X className={styles.mobileCloseIcon} />
            </button>
          </div>
          <nav
            className={styles.mobileNav}
            data-testid={TEST_IDS.MOBILE_NAVIGATION}
          >
            {mainNavigation.map((item) => renderNavigationItem(item, true))}
          </nav>
          {footerNavigation.length > 0 && (
            <div className={styles.desktopSidebarFooter}>
              {footerNavigation.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={styles.desktopFooterLink}
                  data-testid={item.testId}
                  onClick={closeSidebar}
                >
                  <item.icon className={styles.navIcon} />
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          styles.desktopSidebar,
          sidebarCollapsed && styles.desktopSidebarCollapsed
        )}
        data-testid={TEST_IDS.DESKTOP_SIDEBAR}
      >
        <div className={styles.desktopSidebarContent}>
          <div className={styles.desktopHeader}>
            {!sidebarCollapsed && <h1 className={styles.sidebarTitle}>Template</h1>}
            <button
              onClick={toggleSidebarCollapsed}
              className={styles.sidebarToggleBtn}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
            </button>
          </div>
          <nav
            className={styles.desktopNav}
            data-testid={TEST_IDS.DESKTOP_NAVIGATION}
          >
            {mainNavigation.map((item) => {
              if (sidebarCollapsed) {
                const Icon = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const isActive =
                  isCurrentPath(item.href) ||
                  (hasChildren &&
                    item.children?.some((child: any) => isCurrentPath(child.href)));

                const targetHref = item.href || (hasChildren ? item.children?.[0]?.href : undefined) || "/";

                return (
                  <Link
                    key={item.id}
                    to={targetHref}
                    className={cn(
                      styles.navLinkCollapsed,
                      isActive && styles.navLinkActive
                    )}
                    title={item.name}
                    data-testid={item.testId}
                  >
                    <Icon className={styles.navIconCollapsed} />
                  </Link>
                );
              }

              return renderNavigationItem(item, false);
            })}
          </nav>
          {footerNavigation.length > 0 && (
            <div className={styles.desktopSidebarFooter}>
              {footerNavigation.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className={cn(
                    sidebarCollapsed ? styles.navLinkCollapsed : styles.desktopFooterLink
                  )}
                  data-testid={item.testId}
                  title={item.name}
                >
                  <item.icon className={sidebarCollapsed ? styles.navIconCollapsed : styles.navIcon} />
                  {!sidebarCollapsed && item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div 
        className={cn(
          styles.mainContent,
          sidebarCollapsed && styles.mainContentCollapsed
        )} 
        data-testid={TEST_IDS.MAIN_CONTENT}
      >
        <div className={styles.topBar} data-testid={TEST_IDS.TOP_BAR}>
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={openSidebar}
            data-testid={TEST_IDS.MOBILE_MENU_BUTTON}
          >
            <Menu className={styles.mobileMenuIcon} />
          </button>

          <div className={styles.topBarContent}>
            <div className={styles.topBarSpacer} />
            <div className={styles.topBarActions}>
              <ThemeToggle />

              <UserMenu
                onEditProfile={openProfileModal}
                onChangePassword={openPasswordModal}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>

        <main
          className={styles.pageContent}
          data-testid={TEST_IDS.PAGE_CONTENT}
        >
          <div className={styles.pageContainer}>{children}</div>
        </main>

        <footer className={styles.footer} data-testid={TEST_IDS.FOOTER}>
          <div className={styles.footerContent}>
            <div className={styles.footerCopyright}>
              © 2025 All rights reserved.
            </div>
          </div>
        </footer>
      </div>

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={closePasswordModal}
      />

      <ProfileEditModal
        isOpen={showProfileModal}
        onClose={closeProfileModal}
      />
    </div>
  );
};

export default Layout;
