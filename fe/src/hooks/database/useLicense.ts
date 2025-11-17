import { useEffect, useState, useMemo } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { licenseService } from "@/services/licenseService";
import { licenseContractService } from "@/services/contract/licenseContract";
import type { LicenseV6, CreateLicensePayloadV6 } from "@/types/license";

export interface MergedLicense extends LicenseV6 {
  onChainData: LicenseV6 | null;
}

export function useLicenseServices(companyId: string) {
  const [backendLicenses, setBackendLicenses] = useState<LicenseV6[] | null>(
    null
  );
  const [contractLicenses, setContractLicenses] = useState<LicenseV6[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        const beList = await licenseService.getAll();
        if (!cancelled) setBackendLicenses(beList);

        try {
          const cl = await licenseContractService.getLicensesByCompany(
            companyId
          );
          if (!cancelled) setContractLicenses(cl);
        } catch {
          if (!cancelled) setContractLicenses([]);
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [companyId]);

  const merged = useMemo<MergedLicense[] | null>(() => {
    if (!backendLicenses) return null;
    if (!contractLicenses)
      return backendLicenses.map((b) => ({ ...b, onChainData: null }));

    const map = new Map<string, LicenseV6>();
    for (const c of contractLicenses) map.set(c._id, c);

    return backendLicenses.map((b) => ({
      ...b,
      onChainData: map.get(b._id) || null,
    }));
  }, [backendLicenses, contractLicenses]);

  return { backendLicenses, contractLicenses, merged, loading, error };
}

export function useCreateLicenseV6(): UseMutationResult<
  LicenseV6,
  Error,
  CreateLicensePayloadV6,
  unknown
> {
  return useMutation<LicenseV6, Error, CreateLicensePayloadV6, unknown>({
    mutationFn: (payload) => licenseService.create(payload),
  });
}
