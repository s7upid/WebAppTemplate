import { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { ConfirmationDialog, BasePage, PermissionGuard } from "@/components";
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  PageHeaderProps,
} from "@/models";
import {
  createUserManagementHeader,
  createPendingUsersHeader,
  PERMISSION_KEYS,
  USERS_MODULE,
} from "@/config";
import {
  UserDetailsPage,
  PendingUsersPage,
  UserGridPage,
  UserManagementTabs,
  UserFormModal,
  UserRoleModal,
  UserPermissionModal,
} from "@/pages";
import {
  useConfirmation,
  useUserManagementPermissions,
  useUsersQuery,
  useToast,
} from "@/hooks";
import {
  useGenericNavigationFunctions,
  getActiveTab,
  useRouteInfo,
} from "@/utils";
import { ModalPortal } from "solstice-ui";

function UserContainer() {
  const permissions = useUserManagementPermissions();
  const routeInfo = useRouteInfo("users");
  const activeTab = getActiveTab(routeInfo);
  const nav = useGenericNavigationFunctions();
  const { showSuccess, showError } = useToast();
  const confirmation = useConfirmation();
  const {
    add: addUser,
    edit: editUser,
    paginationResult,
    paginationHandlers,
    isLoading,
    error,
    refetch,
  } = useUsersQuery();

  const [state, setState] = useState<{
    selectedUser?: UserResponse;
    modal?: "userForm" | "userCreate" | "role" | "permission";
    formMode?: "create" | "edit";
  }>({});

  const openModal = (
    modal: typeof state.modal,
    user?: UserResponse,
    mode?: "create" | "edit",
  ) => setState({ selectedUser: user, modal, formMode: mode });

  const prevTabRef = useRef<string | null>(null);
  // Track which tab's data is currently loaded to prevent showing stale data
  const [loadedDataTab, setLoadedDataTab] = useState<string | null>(null);

  useEffect(() => {
    if (!paginationHandlers) return;

    if (routeInfo.isMainPage || routeInfo.isPendingPage) {
      const currentTab = activeTab || "all";

      if (prevTabRef.current !== currentTab || prevTabRef.current === null) {
        queueMicrotask(() => setLoadedDataTab(null));

        if (routeInfo.isMainPage) {
          paginationHandlers.refreshWithParams({
            searchTerm: "",
            filters: {},
          });
        } else if (routeInfo.isPendingPage) {
          paginationHandlers.refreshWithParams({
            searchTerm: "",
            filters: { status: "pending" },
          });
        }
        prevTabRef.current = currentTab;
      }
    }
  }, [
    paginationHandlers,
    activeTab,
    routeInfo.isMainPage,
    routeInfo.isPendingPage,
  ]);

  // Update loadedDataTab when loading completes for the current tab
  useEffect(() => {
    const currentTab = activeTab || "all";
    if (!isLoading && loadedDataTab !== currentTab) {
      queueMicrotask(() => setLoadedDataTab(currentTab));
    }
  }, [isLoading, activeTab, loadedDataTab]);

  // Show loading if data doesn't match current tab
  const isDataStale = loadedDataTab !== (activeTab || "all");

  const closeModal = () => setState((prev) => ({ ...prev, modal: undefined }));

  const defaultHeader: PageHeaderProps | null =
    activeTab === "pending"
      ? createPendingUsersHeader()
      : createUserManagementHeader(permissions, () =>
          openModal("userCreate", undefined, "create"),
        );
  const [headerProps, setHeaderProps] = useState<PageHeaderProps>(
    defaultHeader as PageHeaderProps,
  );

  const handleSaveUser = async (
    userData: CreateUserRequest | UpdateUserRequest,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const isCreate = state.formMode === "create";
      const result = isCreate
        ? await addUser(userData as CreateUserRequest)
        : await editUser({
            id: state.selectedUser!.id,
            data: userData as UpdateUserRequest,
          });

      if (result.success) {
        const message = isCreate
          ? USERS_MODULE.messages?.created || "User created successfully"
          : USERS_MODULE.messages?.updated || "User updated successfully";
        showSuccess(
          message,
          `${userData.firstName} ${userData.lastName} has been ${isCreate ? "created" : "updated"} successfully.`,
        );
        closeModal();
        return { success: true };
      } else {
        showError("Error", result.message || "Operation failed");
        return { success: false, error: result.message || "Operation failed" };
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      showError("Error", errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return (
    <PermissionGuard permission={PERMISSION_KEYS.USERS.VIEW}>
      <BasePage {...headerProps}>
        {(routeInfo.isMainPage || routeInfo.isPendingPage) && (
          <UserManagementTabs
            permissions={permissions}
            activeTab={activeTab || "all"}
            onTabChange={(tab) =>
              tab === "pending" ? nav.goToUsersPending() : nav.goToUsers()
            }
          />
        )}

        <Routes>
          <Route
            index
            element={
              <UserGridPage
                paginationResult={paginationResult!}
                paginationHandlers={paginationHandlers}
                isLoading={isLoading || isDataStale}
                error={error?.message}
                onRetry={refetch}
              />
            }
          />
          <Route
            path="/pending"
            element={
              <PendingUsersPage
                paginationResult={paginationResult!}
                paginationHandlers={paginationHandlers}
                isLoading={isLoading || isDataStale}
              />
            }
          />
          <Route
            path="/:id"
            element={
              <UserDetailsPage
                permissions={permissions}
                onEditUser={(user) => openModal("userForm", user, "edit")}
                onManageRoles={(user) => openModal("role", user)}
                onManagePermissions={(user) => openModal("permission", user)}
                setHeaderProps={setHeaderProps}
                handleCreateUser={() =>
                  openModal("userCreate", undefined, "create")
                }
              />
            }
          />
        </Routes>

        <ModalPortal>
          {state.modal === "userForm" && (
            <UserFormModal
              permissions={permissions}
              isOpen
              onClose={closeModal}
              user={state.selectedUser}
              onSave={handleSaveUser}
              formMode="edit"
            />
          )}
          {state.modal === "userCreate" && (
            <UserFormModal
              permissions={permissions}
              isOpen
              onClose={closeModal}
              onSave={handleSaveUser}
              formMode="create"
            />
          )}
          {state.modal === "role" && (
            <UserRoleModal
              permissions={permissions}
              isOpen
              onClose={closeModal}
              user={state.selectedUser}
            />
          )}
          {state.modal === "permission" && (
            <UserPermissionModal
              permissions={permissions}
              isOpen
              onClose={closeModal}
              user={state.selectedUser}
            />
          )}
        </ModalPortal>
        <ConfirmationDialog {...confirmation.dialogProps} />
      </BasePage>
    </PermissionGuard>
  );
}

export default UserContainer;
