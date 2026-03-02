import React from "react";
import { Shield, Users, Calendar } from "lucide-react";
import { RoleResponse } from "@/models";
import { Card } from "solstice-ui";

interface RoleStatsSectionProps {
  role: RoleResponse;
}

const RoleStatsSection: React.FC<RoleStatsSectionProps> = ({ role }) => {
  return (
    <Card
      title={`${role.name}`}
      icon={Shield}
      iconSize="sm"
      layout="horizontal"
      detailsPerRow={4}
      details={[
        {
          label: "Role Type",
          value: `${role.isSystem ? "System Role" : "Custom Role"}`,
          icon: Shield,
        },
        {
          label: "Users Assigned",
          value: `${(role.users?.length ?? 0)} users`,
          icon: Users,
        },
        {
          label: "Permissions Assigned",
          value: `${(role.permissions?.length ?? 0)} permissions`,
          icon: Users,
        },
        {
          label: "Created",
          value: new Date(role.createdAt).toLocaleDateString(),
          icon: Calendar,
        },
      ]}
    />
  );
};

export default RoleStatsSection;
