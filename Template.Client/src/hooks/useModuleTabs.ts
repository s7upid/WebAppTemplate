import { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const noop = () => {};
import type { TabItem } from "solstice-ui";
import { PageTabConfig, DetailTabConfig, ModuleConfig } from "@/config/modules/types";
import { getModulePageTabs, getModuleDetailTabs, getModule, ModuleId } from "@/config/modules";
import { usePermissions } from "./usePermissions";

interface UseModuleTabsOptions {
  customHasPermission?: (permission: string) => boolean;
}

interface UseModulePageTabsReturn {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  hasPermission: (permission: string) => boolean;
  module: ModuleConfig | undefined;
  activeFilter: Record<string, unknown> | undefined;
}

interface UseModuleDetailTabsReturn {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  hasPermission: (permission: string) => boolean;
}

export function useModulePageTabs(
  moduleId: ModuleId | string,
  options?: UseModuleTabsOptions
): UseModulePageTabsReturn {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission: hookHasPermission } = usePermissions();

  const hasPermission = options?.customHasPermission ?? hookHasPermission;
  const module = getModule(moduleId);
  const tabConfigs = useMemo(
    () => getModulePageTabs(moduleId) ?? [],
    [moduleId]
  );

  const tabs: TabItem[] = useMemo(() => {
    return tabConfigs.map((tab: PageTabConfig) => ({
      id: tab.id,
      label: tab.label,
      icon: tab.icon,
      permission: tab.permission,
      testId: tab.testId,
    }));
  }, [tabConfigs]);

  const activeTab = useMemo(() => {
    const currentPath = location.pathname;
    const matchingTab = tabConfigs
      .filter((tab: PageTabConfig) => currentPath.startsWith(tab.path) || currentPath === tab.path)
      .sort((a: PageTabConfig, b: PageTabConfig) => b.path.length - a.path.length)[0];
    return matchingTab?.id ?? tabConfigs[0]?.id ?? "";
  }, [location.pathname, tabConfigs]);

  const activeFilter = useMemo(() => {
    const tab = tabConfigs.find((t: PageTabConfig) => t.id === activeTab);
    return tab?.filter;
  }, [activeTab, tabConfigs]);

  return useMemo(
    () => ({
      tabs,
      activeTab,
      onTabChange: (tabId: string) => {
        const tab = tabConfigs.find((t: PageTabConfig) => t.id === tabId);
        if (tab) navigate(tab.path);
      },
      hasPermission,
      module,
      activeFilter,
    }),
    [tabs, activeTab, tabConfigs, navigate, hasPermission, module, activeFilter]
  );
}

export function useModuleDetailTabs(
  moduleId: ModuleId | string,
  initialTab?: string,
  options?: UseModuleTabsOptions
): UseModuleDetailTabsReturn {
  const { hasPermission: hookHasPermission } = usePermissions();

  const hasPermission = options?.customHasPermission ?? hookHasPermission;
  const tabConfigs = useMemo(
    () => getModuleDetailTabs(moduleId) ?? [],
    [moduleId]
  );

  const tabs: TabItem[] = useMemo(() => {
    return tabConfigs.map((tab: DetailTabConfig) => ({
      id: tab.id,
      label: tab.label,
      icon: tab.icon,
      permission: tab.permission,
      testId: tab.testId,
    }));
  }, [tabConfigs]);

  const defaultTab = initialTab ?? tabConfigs[0]?.id ?? "";

  return useMemo(
    () => ({ tabs, activeTab: defaultTab, onTabChange: noop, hasPermission }),
    [tabs, defaultTab, hasPermission]
  );
}

export function getPageTabConfigs(moduleId: ModuleId | string): PageTabConfig[] {
  return getModulePageTabs(moduleId) ?? [];
}

export function getDetailTabConfigs(moduleId: ModuleId | string): DetailTabConfig[] {
  return getModuleDetailTabs(moduleId) ?? [];
}

export default useModulePageTabs;
