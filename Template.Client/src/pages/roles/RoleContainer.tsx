import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CreateRoleRequest, UpdateRoleRequest, RoleResponse } from "@/models";
import { RoleGridPage, RoleDetailsPage, RoleFormModal } from "@/pages";
import { handleEntitySave } from "@/utils";
import { ConfirmationDialog, BasePage, PermissionGuard } from "@/components";
import {
  useRoleManagementPermissions,
  useRolesQuery,
  useConfirmation,
  useToast,
  useOnceWhen,
} from "@/hooks";
import {
  createRoleManagementHeader,
  PERMISSION_KEYS,
  ROLES_MODULE,
} from "@/config";
import { PageHeaderProps } from "@/models";
import { useRouteInfo } from "@/utils";

function RoleContainer() {
  const permissions = useRoleManagementPermissions();
  const routeInfo = useRouteInfo("roles");
  const { showSuccess } = useToast();
  const confirmation = useConfirmation();
  const {
    add: addRole,
    edit: editRole,
    paginationResult,
    paginationHandlers,
    isLoading,
    error,
    refetch,
  } = useRolesQuery();

  useOnceWhen(!!paginationHandlers && routeInfo.isMainPage, () => {
    paginationHandlers!.refreshWithCurrentFilters();
  });

  const [state, setState] = useState<{
    selectedRole?: RoleResponse;
    modalOpen: boolean;
    formMode: "create" | "edit";
  }>({ modalOpen: false, formMode: "create" });

  const openModal = (role?: RoleResponse, mode: "create" | "edit" = "create") =>
    setState({ selectedRole: role, modalOpen: true, formMode: mode });

  const closeModal = () => setState((prev) => ({ ...prev, modalOpen: false }));

  const defaultHeader = createRoleManagementHeader(permissions, () =>
    openModal(undefined, "create"),
  );
  const [headerProps, setHeaderProps] =
    useState<PageHeaderProps>(defaultHeader);

  const handleSaveRole = (roleData: CreateRoleRequest | UpdateRoleRequest) =>
    handleEntitySave(roleData, {
      formMode: state.formMode,
      addEntity: addRole,
      editEntity: ({ id, data }) => editRole({ id, data }),
      selectedEntity: state.selectedRole,
      entityName: roleData.name,
      successMessages: {
        created: ROLES_MODULE.messages?.created || "Role created successfully",
        updated: ROLES_MODULE.messages?.updated || "Role updated successfully",
      },
      showSuccess,
    });

  return (
    <PermissionGuard permission={PERMISSION_KEYS.ROLES.VIEW}>
      <BasePage {...headerProps}>
        <Routes>
          <Route
            index
            element={
              <RoleGridPage
                paginationResult={paginationResult!}
                paginationHandlers={paginationHandlers}
                isLoading={isLoading && paginationResult?.totalCount === 0}
                error={error ?? null}
                onRetry={refetch}
              />
            }
          />
          <Route
            path="/:id"
            element={
              <RoleDetailsPage
                permissions={permissions}
                onEditRole={(role) => openModal(role, "edit")}
                setHeaderProps={setHeaderProps}
                handleCreateRole={() => openModal(undefined, "create")}
              />
            }
          />
        </Routes>

        {state.modalOpen && (
          <RoleFormModal
            permissions={permissions}
            isOpen
            onClose={closeModal}
            role={state.selectedRole}
            formMode={state.formMode}
            onSave={handleSaveRole}
          />
        )}
        <ConfirmationDialog {...confirmation.dialogProps} />
      </BasePage>
    </PermissionGuard>
  );
}

export default RoleContainer;
