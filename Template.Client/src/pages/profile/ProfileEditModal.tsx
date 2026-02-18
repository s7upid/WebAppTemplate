import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, UserIcon, XCircle } from "lucide-react";
import { AvatarUploader, Button, Input, ModalPage } from "@/components";
import { useToast, useUsersQuery, useAuth } from "@/hooks";
import styles from "./ProfileEditModal.module.css";
import { UpdateUserRequest } from "@/models";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  avatar?: string;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const { updateProfile, mutations } = useUsersQuery();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      avatar: "",
    },
  });

  const watchedAvatar = watch("avatar");
  const isLoading = mutations.update.isPending;

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        avatar: user.avatar || "",
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user, reset]);

  useEffect(() => {
    if (watchedAvatar) {
      setAvatarPreview(watchedAvatar);
    }
  }, [watchedAvatar]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const result = await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
      } as UpdateUserRequest);

      if (result.success) {
        addToast({
          type: "success",
          title: "Success",
          message: "Profile updated successfully",
        });
        onClose();
      } else {
        addToast({
          type: "error",
          title: "Error",
          message: result.message || "Failed to update profile",
        });
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Error",
        message: (error as Error).message || "Failed to update profile",
      });
    }
  };

  const handleAvatarChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setValue("avatar", result);
      setAvatarPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setValue("avatar", "");
    setAvatarPreview(null);
  };

  if (!isOpen) return null;

  return (
    <ModalPage isOpen={isOpen} onClose={onClose} title="Edit Profile" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <AvatarUploader
          avatarUrl={avatarPreview || undefined}
          editable
          onChange={handleAvatarChange}
          onRemove={removeAvatar}
        />

        <Input
          {...register("firstName", {
            required: "First name is required",
            minLength: {
              value: 2,
              message: "First name must be at least 2 characters",
            },
          })}
          type="text"
          label="First Name"
          icon={UserIcon}
          placeholder="Enter first name"
          error={errors.firstName?.message}
          required
        />

        <Input
          {...register("lastName", {
            required: "Last name is required",
            minLength: {
              value: 2,
              message: "Last name must be at least 2 characters",
            },
          })}
          type="text"
          label="Last Name"
          icon={UserIcon}
          placeholder="Enter last name"
          error={errors.lastName?.message}
          required
        />

        <div className={"modal-actions"}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            icon={XCircle}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            icon={Save}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </ModalPage>
  );
};

export default ProfileEditModal;
