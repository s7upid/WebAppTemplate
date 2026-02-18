import React from "react";
import { ModalPage, Button, Input } from "@/components";
import { PermissionSelector } from "@/pages";
import { Save, XCircle } from "lucide-react";
import { TEST_IDS, RoleManagementPermissions } from "@/config";
import { RoleResponse, CreateRoleRequest, UpdateRoleRequest, PermissionResponse } from "@/models";
import { useAllPermissions, useToast } from "@/hooks";
import { roleCreateSchema } from "@/validations/schemas";
import { handleSubmitForm } from "@/utils";

type RoleFormData = {
  name: string;
  description: string;
  permissions: string[];
};

interface RoleFormModalProps {
  permissions: RoleManagementPermissions;
  isOpen: boolean;
  onClose: () => void;
  role?: RoleResponse;
  formMode: "create" | "edit";
  onSave: (data: CreateRoleRequest | UpdateRoleRequest) => Promise<any>;
}

const RoleFormModal: React.FC<RoleFormModalProps> = ({
  permissions,
  isOpen,
  onClose,
  role,
  formMode,
  onSave,
}) => {
  const isEditMode = formMode === "edit";
  const isCreateMode = formMode === "create";

  if (isEditMode && !permissions.canEditRoles) return null;
  if (isCreateMode && !permissions.canCreateRoles) return null;

  const isSystemRole = role?.isSystem;
  const { permissions: availablePermissions } = useAllPermissions();
  const { showError } = useToast();

  const defaultValues: RoleFormData = {
    name: "",
    description: "",
    permissions: [],
  };

  const entityData: RoleFormData | undefined = React.useMemo(() => {
    if (!role) return undefined;
    return {
      name: role.name,
      description: role.description,
      permissions: (role.permissions || []).map((p: any) =>
        typeof p === "string" ? p : p.key
      ),
    };
  }, [role]);

  const [formData, setFormData] = React.useState<RoleFormData>(defaultValues);

  React.useEffect(() => {
    if (!isOpen) return;
    setFormData(entityData || defaultValues);
  }, [isOpen, entityData]);

  const handlePermissionToggle = (permission: string) => {
    const currentPermissions = formData.permissions || [];
    const newPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter((p) => p !== permission)
      : [...currentPermissions, permission];
    setFormData({ ...formData, permissions: newPermissions });
  };

  const handleBulkPermissionChange = (permissions: string[]) => {
    setFormData({ ...formData, permissions });
  };

  const onSubmit = async () => {
    const selectedPermissionKeys = (formData.permissions || [])
      .map((key: string) => availablePermissions.find((p: PermissionResponse) => p.key === key))
      .filter((p): p is PermissionResponse => Boolean(p))
      .map((p: PermissionResponse) => p.key);

    await handleSubmitForm<RoleFormData>({
      data: { ...formData, permissions: selectedPermissionKeys },
      schema: roleCreateSchema,
      onSave: async (data) => {
        if (isCreateMode) {
          return onSave({
            name: data.name,
            description: data.description,
            permissionKeys: data.permissions,
          });
        } else {
          return onSave({
            name: data.name,
            description: data.description,
            permissionKeys: data.permissions,
          });
        }
      },
      entityName: formData.name,
      showError,
    });

    onClose();
  };

  return (
    <ModalPage
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Role" : "Create Role"}
      size="md"
    >
      <form
        id="role-form"
        data-testid={TEST_IDS.ROLE_FORM}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y"
      >
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Role name"
          required
          data-testid={TEST_IDS.ROLE_NAME_INPUT}
        />

        <label className="input-label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          placeholder="Role description"
          className="input-field"
          required
        />

        <PermissionSelector
          selectedPermissions={formData.permissions}
          onPermissionToggle={handlePermissionToggle}
          onBulkPermissionChange={handleBulkPermissionChange}
          disabled={isSystemRole}
        />

        <div className="modal-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            icon={XCircle}
            data-testid={TEST_IDS.CANCEL_ROLE_BUTTON}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="role-form"
            icon={Save}
            data-testid={TEST_IDS.SUBMIT_BUTTON}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </ModalPage>
  );
};

export default RoleFormModal;
