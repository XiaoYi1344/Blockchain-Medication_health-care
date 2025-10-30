// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { shipmentService } from "@/services/shipmentService";
// import {
//   CreateShipmentRequest,
//   UpdateShipmentRequest,
//   Shipment,
// } from "@/types/shipment";

// export const useShipments = () => {
//   return useQuery<Shipment[]>({
//     queryKey: ["shipments"],
//     queryFn: () => shipmentService.getAllByCompany(), // trả về Shipment[]
//   });
// };

// export const useShipmentByUser = () => {
//   return useQuery<Shipment[]>({
//     queryKey: ["shipments-by-user"],
//     queryFn: () => shipmentService.getAllByUser(),
//   });
// };

// export const useShipmentByOrder = (orderCode: string) => {
//   return useQuery<Shipment[]>({
//     queryKey: ["shipment-by-order", orderCode],
//     queryFn: () => shipmentService.getByOrderCode(orderCode),
//     enabled: !!orderCode,
//   });
// };

// export const useCreateShipment = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (data: CreateShipmentRequest) => shipmentService.create(data),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["shipments"] });
//     },
//   });
// };

// export const useUpdateShipment = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (data: UpdateShipmentRequest) => shipmentService.update(data),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["shipments"] });
//     },
//   });
// };

// export const useStopShipment = () => {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (shipmentId: string) => shipmentService.stop(shipmentId),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["shipments"] });
//     },
//   });// src/hooks/useShipmentServices.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { shipmentService } from "@/services/shipmentService";
import type {
  Shipment,
  CreateShipmentRequest,
  CreateShipmentResponse,
  UpdateShipmentRequest,
} from "@/types/shipment";

// ========================
// FETCH ALL SHIPMENTS BY COMPANY
// ========================
export const useShipmentsByCompany = () => {
  return useQuery<Shipment[]>({
    queryKey: ["shipments", "company"],
    queryFn: () => shipmentService.getAllByCompany(),
  });
};

// ========================
// FETCH ALL SHIPMENTS BY USER
// ========================
export const useShipmentsByUser = () => {
  return useQuery<Shipment[]>({
    queryKey: ["shipments", "user"],
    queryFn: () => shipmentService.getAllByUser(),
  });
};

// ========================
// FETCH BY ORDER CODE
// ========================
export const useShipmentsByOrder = (orderCode?: string) => {
  return useQuery<Shipment[]>({
    queryKey: ["shipments", "order", orderCode],
    queryFn: () => shipmentService.getByOrderCode(orderCode!),
    enabled: !!orderCode,
  });
};

// ========================
// CREATE SHIPMENT
// ========================
export const useCreateShipment = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateShipmentResponse, Error, CreateShipmentRequest>({
    mutationFn: (data) => shipmentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
};

// ========================
// UPDATE SHIPMENT
// ========================
export const useUpdateShipment = () => {
  const queryClient = useQueryClient();

  return useMutation<Shipment, Error, UpdateShipmentRequest>({
    mutationFn: (data) => shipmentService.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
};

// ========================
// STOP SHIPMENT
// ========================
export const useStopShipment = () => {
  const queryClient = useQueryClient();

  return useMutation<Shipment, Error, string>({
    mutationFn: (shipmentId) => shipmentService.stop(shipmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
};
