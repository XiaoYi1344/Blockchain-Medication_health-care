import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { companyService } from "@/services/companyService";
import {
  CompanyV6,
  UpdateCompanyPayloadV6,
  GetCompanyQueryV6,
} from "@/types/company";

// Hook lấy thông tin company
export const useCompanyV6 = (query: GetCompanyQueryV6) => {
  return useQuery<CompanyV6, Error>({
    queryKey: ["companyV6", query],
    queryFn: () => companyService.get(query),
    staleTime: 5 * 60 * 1000, // cache 5 phút
  });
};

// Hook cập nhật company
export const useUpdateCompanyV6 = (): UseMutationResult<
  CompanyV6, 
  Error, 
  UpdateCompanyPayloadV6
> => {
  const queryClient = useQueryClient();
  return useMutation<CompanyV6, Error, UpdateCompanyPayloadV6>({
    mutationFn: (payload) => companyService.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyV6"] });
    },
  });
};

export const useCompanyName = (companyId?: string | null) => {
  const query = { companyId: companyId || undefined };
  const { data, isLoading, error } = useCompanyV6(query);
  return {
    name: data?.name || "Unknown",
    isLoading,
    error,
  };
};