import React, { useState, useRef, useEffect } from "react";
import { User, ChevronDown, Edit, Key, LogOut } from "lucide-react";
import { useAuth } from "@/hooks";
import { TEST_IDS } from "@/config/constants";
import styles from "./UserMenu.module.css";

interface UserMenuProps {
  onEditProfile: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  onEditProfile,
  onChangePassword,
  onLogout,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditProfile = () => {
    onEditProfile();
    setShowUserMenu(false);
  };

  const handleChangePassword = () => {
    onChangePassword();
    setShowUserMenu(false);
  };

  return (
    <>
      <div
        className={styles.relative}
        data-testid={TEST_IDS.USER_MENU}
        ref={userMenuRef}
      >
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={styles.userMenuButton}
        >
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <User className={styles.userIcon} />
            </div>
            <div className={styles.hiddenLg}>
              <p className={styles.userName} data-testid={TEST_IDS.USER_NAME}>
                {user?.firstName} {user?.lastName}
              </p>
              <p className={styles.userEmail} data-testid={TEST_IDS.USER_EMAIL}>
                {user?.email}
              </p>
            </div>
            <ChevronDown className={styles.userChevron} />
          </div>
        </button>

        {showUserMenu && (
          <div className={styles.userDropdown}>
            <div className={styles.userDropdownContent}>
              <button
                onClick={handleEditProfile}
                className={styles.userDropdownItem}
              >
                <Edit className={styles.dropdownIcon} />
                Edit Profile
              </button>
              <button
                onClick={handleChangePassword}
                className={styles.userDropdownItem}
              >
                <Key className={styles.dropdownIcon} />
                Change Password
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onLogout}
        className={styles.logoutBtn}
        data-testid={TEST_IDS.LOGOUT_BUTTON}
      >
        <LogOut className={styles.logoutIcon} />
        <span className={styles.hiddenLgBlock}>Logout</span>
      </button>
    </>
  );
};

export default UserMenu;
