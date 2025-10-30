import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Location,
  CreateLocationReq,
  UpdateLocationReq,
} from "@/types/location";
import { locationService } from "@/services/locationService";

export const useLocations = (isActive: boolean) => {
  return useQuery<Location[], Error>({
    queryKey: ["locations", isActive],
    queryFn: () => locationService.getAll(isActive),
  });
};

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLocationReq) => locationService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });
};

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateLocationReq) => locationService.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["locations"] }),
  });
};
