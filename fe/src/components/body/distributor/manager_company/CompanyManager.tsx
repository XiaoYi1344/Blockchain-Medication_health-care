// components/v6/CompanyManager.tsx
import React from "react";
import { CompanyWidget } from "./widget/company";
import { LicenseWidget } from "./widget/license";

interface CompanyManagerProps {
  accessToken: string;
  companyId?: string | null;
}

export const CompanyManager: React.FC<CompanyManagerProps> = ({
  // accessToken,
  companyId,
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Company Widget */}
      <CompanyWidget companyId={companyId} />

      {/* License Widget */}
<LicenseWidget companyId={companyId} />

    </div>
  );
};
