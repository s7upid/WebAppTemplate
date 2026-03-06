import { useEffect, useState, type ChangeEvent } from "react";
import { Dialog, Button, Input, Dropdown, LoadingSpinner, Form } from "solstice-ui";
import { AvatarUploader } from "@/components";
import { XCircle, Save, Mail, UserIcon } from "lucide-react";
import { useRolesQuery, useToast } from "@/hooks";
import { TEST_IDS, UserManagementPermissions } from "@/config";
import { CreateUserRequest, UpdateUserRequest, UserResponse, RoleResponse } from "@/models";
import { userCreateSchema, userUpdateSchema } from "@/validations/schemas";
import { handleSubmitForm } from "@/utils";

type UserFormData = {
  firstName: string;
  lastName: string;
  email?: string;
  avatar?: string;
  status?: number;
  roleId?: string;
};

interface UserFormModalProps {
  permissions: UserManagementPermissions;
  isOpen: boolean;
  onClose: () => void;
  user?: UserResponse;
  onSave: (userData: CreateUserRequest | UpdateUserRequest) => Promise<{ success: boolean; error?: string }>;
  isProfileEdit?: boolean;
  formMode?: "create" | "edit";
}

function UserFormModal({
  permissions,
  isOpen,
  onClose,
  user,
  onSave,
  isProfileEdit = false,
  formMode = "edit",
}: UserFormModalProps) {
  const isEditMode = formMode === "edit";
  const isCreateMode = formMode === "create";
  const { roles, isLoading } = useRolesQuery();
  const { showError } = useToast();

  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
    status: 2,
    roleId: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    // Create mode: always start with empty form. Edit mode: populate from user.
    // Defer setState to avoid synchronous setState in effect (react-hooks/set-state-in-effect).
    const next = isCreateMode
      ? {
          formData: {
            firstName: "",
            lastName: "",
            email: "",
            avatar: "",
            status: 2,
            roleId: "",
          } as UserFormData,
          avatarPreview: null as string | null,
        }
      : user && isEditMode
        ? {
            formData: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              avatar: user.avatar || "",
              status: typeof user.userStatus === "number" ? user.userStatus : 0,
              roleId: user.role?.id || "",
            } as UserFormData,
            avatarPreview: user.avatar || null,
          }
        : null;
    if (next) {
      queueMicrotask(() => {
        setFormData(next.formData);
        setAvatarPreview(next.avatarPreview);
      });
    }
  }, [isOpen, isCreateMode, isEditMode, user]);

  if (isEditMode && !isProfileEdit && !permissions.canEditUsers) return null;
  if (isCreateMode && !permissions.canCreateUsers) return null;

  const handleAvatarChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData({ ...formData, avatar: result });
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setFormData({ ...formData, avatar: "" });
    setAvatarPreview(null);
  };

  const onSubmit = async () => {
    await handleSubmitForm<UserFormData>({
      data: formData,
      schema: isCreateMode ? userCreateSchema : userUpdateSchema,
      onSave: async (data) => {
        if (isCreateMode) {
          return onSave({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email!,
            roleId: data.roleId!,
            status: data.status ?? 2,
          } as CreateUserRequest);
        } else {
          return onSave({
            firstName: data.firstName,
            lastName: data.lastName,
            avatar: data.avatar,
            status: isProfileEdit ? user?.userStatus ?? 0 : data.status ?? 0,
          } as UpdateUserRequest);
        }
      },
      entityName: `${formData.firstName} ${formData.lastName}`,
      showError,
    });

    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        isCreateMode
          ? "Create User"
          : isProfileEdit
          ? "Edit Profile"
          : "Edit User"
      }
      size="md"
    >
      <Form
        id="user-form"
        data-testid={TEST_IDS.USER_FORM}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <AvatarUploader
          avatarUrl={avatarPreview || undefined}
          editable
          onChange={handleAvatarChange}
          onRemove={removeAvatar}
        />

        <Input
          value={formData.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
          type="email"
          label="Email"
          placeholder="Enter email address"
          disabled={isEditMode}
          required
          icon={Mail}
        />

        <Input
          value={formData.firstName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          label="First Name"
          placeholder="Enter first name"
          required
          icon={UserIcon}
        />

        <Input
          value={formData.lastName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          label="Last Name"
          placeholder="Enter last name"
          required
          icon={UserIcon}
        />

        {isCreateMode && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="sm" text="Loading roles..." />
              </div>
            ) : (
              <Dropdown
                label="Role"
                placeholderOption="Choose a role"
                options={roles.map((r: RoleResponse) => ({ value: r.id, label: r.name }))}
                disabled={roles.length === 0}
                value={formData.roleId}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, roleId: value })
                }
              />
            )}
          </>
        )}

        {!isProfileEdit && (
          <Dropdown
            label="Status"
            options={[
              { value: 0, label: "Active" },
              { value: 1, label: "Inactive" },
              { value: 2, label: "Pending" },
              { value: 3, label: "Suspended" },
            ]}
            value={formData.status}
            onValueChange={(value: string) =>
              setFormData({ ...formData, status: Number(value) })
            }
          />
        )}

        <div className={"modal-actions"}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            icon={XCircle}
          >
            Cancel
          </Button>
          <Button type="submit" form="user-form" icon={Save} variant="primary">
            {isCreateMode ? "Create User" : "Save Changes"}
          </Button>
        </div>
      </Form>
    </Dialog>
  );
}

export default UserFormModal;
