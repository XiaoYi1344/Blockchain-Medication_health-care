// "use client";

// import React, { useEffect, useRef } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Grid,
//   TextField,
//   Stack,
//   InputLabel,
//   FormControl,
//   Select,
//   MenuItem,
//   Box,
//   Paper,
//   Fade,
// } from "@mui/material";
// import { useForm, Controller, useFieldArray } from "react-hook-form";
// import { TransitionProps } from "@mui/material/transitions";
// import { useCategoriesByStatus } from "@/hooks/database/useCategory";
// import { backendService } from "@/services/drugService";
// import toast from "react-hot-toast";

// // ============================
// // Transition Component
// // ============================
// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & { children: React.ReactElement },
//   ref: React.Ref<unknown>
// ) {
//   return <Fade ref={ref} {...props} />;
// });

// export type ActiveIngredient = {
//   name: string;
//   strength: string;
//   route:
//     | "oral"
//     | "injection"
//     | "IV infusion"
//     | "inhalation"
//     | "rectal insertion";
// };

// export type StorageCondition = {
//   temperature: string;
//   humidity: string;
//   type: "domestic" | "abroad";
// };

// export type FormValues = {
//   _id: string;
//   name: string;
//   description: string;
//   categoryIds: string[];
//   images: File[];
//   imagePrimary: File | null; // ✅ single file
//   uom: string;
//   uomQuantity: number;
//   gtin: string;
//   activeIngredient: ActiveIngredient[];
//   storageConditions: StorageCondition[];
// };

// export type DrugFormProps = {
//   open: boolean;
//   onClose: () => void;
//   initial?: FormValues | null;
//   onSaved?: () => void;
//   mode?: "create" | "edit" | "editImage";
// };

// export default function DrugForm({
//   open,
//   onClose,
//   initial,
//   onSaved,
//   mode,
// }: DrugFormProps) {
//   const isMounted = useRef(true);

//   const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
//     defaultValues: {
//       name: "",
//       description: "",
//       categoryIds: [],
//       images: [],
//       imagePrimary: null,
//       uom: "",
//       uomQuantity: 0,
//       gtin: "",
//       activeIngredient: [],
//       storageConditions: [],
//     },
//   });

//   const {
//     fields: activeFields,
//     append: appendActive,
//     remove: removeActive,
//   } = useFieldArray({ control, name: "activeIngredient" });

//   const {
//     fields: storageFields,
//     append: appendStorage,
//     remove: removeStorage,
//   } = useFieldArray({ control, name: "storageConditions" });

//   const { data: categories } = useCategoriesByStatus(true);

//   useEffect(() => {
//     if (initial) reset(initial);
//   }, [initial, reset]);

//   const getCookie = (name: string) => {
//     if (typeof document === "undefined") return null;
//     const match = document.cookie.match(
//       new RegExp("(^| )" + name + "=([^;]+)")
//     );
//     return match ? decodeURIComponent(match[2]) : null;
//   };

//   // const onSubmit = async (data: FormValues) => {
//   //   const userId = getCookie("userId");
//   //   if (!userId) {
//   //     toast.error("Cookie userId chưa tồn tại.");
//   //     return;
//   //   }

//   //   try {
//   //     const formData = new FormData();

//   //     if (mode !== "editImage") {
//   //       formData.append("name", data.name.trim());
//   //       formData.append("description", data.description);
//   //       formData.append("uom", data.uom);
//   //       formData.append("uomQuantity", String(data.uomQuantity));
//   //       formData.append("gtin", data.gtin);
//   //       formData.append("isActive", "draft");
//   //       formData.append("createdBy", userId);

//   //       data.categoryIds.forEach((id) => formData.append("categoryIds[]", id));
//   //       formData.append(
//   //         "activeIngredient",
//   //         JSON.stringify(data.activeIngredient)
//   //       );
//   //       formData.append(
//   //         "storageConditions",
//   //         JSON.stringify(data.storageConditions)
//   //       );

//   //       // Ảnh đại diện
//   //       if (data.imagePrimary) {
//   //         formData.append("imagePrimary", data.imagePrimary);
//   //       }

//   //       // Ảnh phụ
//   //       if (data.images.length > 0) {
//   //         data.images.forEach((file) => formData.append("images", file));
//   //       }
//   //     } else {
//   //       // chỉ update ảnh chính
//   //       if (!data.imagePrimary) {
//   //         toast.error("Vui lòng chọn ảnh để cập nhật!");
//   //         return;
//   //       }
//   //       formData.append("imagePrimary", data.imagePrimary);
//   //       if (!initial?._id) {
//   //         toast.error("Không tìm thấy productId để cập nhật ảnh!");
//   //         return;
//   //       }
//   //     }

//   //     let response;
//   //     if (mode === "create") {
//   //       response = await backendService.createProduct(formData);
//   //       toast.success("✅ Đã tạo thuốc dạng draft!");
//   //     } else if (mode === "edit") {
//   //       formData.append("productId", initial!._id!);
//   //       response = await backendService.updateProduct(formData);
//   //       toast.success("✅ Đã cập nhật thuốc!");
//   //     } else if (mode === "editImage") {
//   //       response = await backendService.updatePrimaryImage(
//   //         initial!._id!,
//   //         data.imagePrimary!
//   //       );
//   //       toast.success("✅ Đã cập nhật ảnh thuốc!");
//   //     }

//   //     onSaved?.();
//   //     onClose();
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error("❌ Lưu thất bại!");
//   //   }
//   // };

//   const onSubmit = async (data: FormValues) => {
//     const userId = getCookie("userId");
//     if (!userId) {
//       toast.error("Cookie userId chưa tồn tại.");
//       return;
//     }

//     try {
//       const formData = new FormData();

//       if (mode === "create") {
//         formData.append("name", data.name.trim());
//         formData.append("description", data.description);
//         formData.append("uom", data.uom);
//         formData.append("uomQuantity", String(data.uomQuantity));
//         formData.append("gtin", data.gtin);
//         formData.append("isActive", "draft");
//         formData.append("createdBy", userId);

//         data.categoryIds.forEach((id) => formData.append("categoryIds[]", id));
//         formData.append(
//           "activeIngredient",
//           JSON.stringify(data.activeIngredient)
//         );
//         formData.append(
//           "storageConditions",
//           JSON.stringify(data.storageConditions)
//         );

//         // ✅ Chỉ gửi images (không có imagePrimary)
//         if (data.images.length > 0) {
//           data.images.forEach((file) => formData.append("images", file));
//         }
//       } else if (mode === "edit") {
//         // edit thông thường vẫn dùng imagePrimary nếu muốn
//         formData.append("productId", initial!._id!);
//         formData.append("name", data.name.trim());
//         formData.append("description", data.description);
//         formData.append("uom", data.uom);
//         formData.append("uomQuantity", String(data.uomQuantity));
//         formData.append("gtin", data.gtin);
//         formData.append(
//           "activeIngredient",
//           JSON.stringify(data.activeIngredient)
//         );
//         formData.append(
//           "storageConditions",
//           JSON.stringify(data.storageConditions)
//         );
//         data.categoryIds.forEach((id) => formData.append("categoryIds[]", id));

//         if (data.imagePrimary) {
//           formData.append("imagePrimary", data.imagePrimary);
//         }
//         if (data.images.length > 0) {
//           data.images.forEach((file) => formData.append("images", file));
//         }
//       }

//       // Gọi API
//       let response;
//       if (mode === "create") {
//         response = await backendService.createProduct(formData);
//         toast.success("✅ Đã tạo thuốc dạng draft!");
//       } else if (mode === "edit") {
//         response = await backendService.updateProduct(formData);
//         toast.success("✅ Đã cập nhật thuốc!");
//       } else if (mode === "editImage") {
//         if (!initial?._id || !data.imagePrimary)
//           throw new Error("Thiếu dữ liệu để update ảnh");
//         response = await backendService.updatePrimaryImage(
//           initial._id,
//           data.imagePrimary
//         );
//         toast.success("✅ Đã cập nhật ảnh thuốc!");
//       }

//       onSaved?.();
//       onClose();
//     } catch (err) {
//       console.error(err);
//       toast.error("❌ Lưu thất bại!");
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth="md"
//       TransitionComponent={Transition}
//     >
//       <DialogTitle>
//         {mode === "edit"
//           ? "Sửa thuốc"
//           : mode === "editImage"
//           ? "Sửa ảnh thuốc"
//           : "Thêm thuốc"}{" "}
//         (Draft)
//       </DialogTitle>

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <DialogContent dividers>
//           <Paper sx={{ p: 2 }}>
//             <Grid container spacing={2}>
//               {/* Left */}
//               <Grid size={{ xs: 12, sm: 8 }}>
//                 {/* Tên */}
//                 <Controller
//                   name="name"
//                   control={control}
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       label="Tên thuốc"
//                       fullWidth
//                       required
//                     />
//                   )}
//                 />

//                 {/* Mô tả */}
//                 <Box mt={2}>
//                   <Controller
//                     name="description"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField
//                         {...field}
//                         label="Mô tả"
//                         fullWidth
//                         multiline
//                         rows={3}
//                       />
//                     )}
//                   />
//                 </Box>

//                 {/* Danh mục */}
//                 <Box mt={2}>
//                   <Controller
//                     name="categoryIds"
//                     control={control}
//                     render={({ field }) => (
//                       <FormControl fullWidth>
//                         <InputLabel>Danh mục</InputLabel>
//                         <Select {...field} multiple>
//                           {categories?.map((cat) => (
//                             <MenuItem key={cat._id} value={cat._id}>
//                               {cat.name}
//                             </MenuItem>
//                           ))}
//                         </Select>
//                       </FormControl>
//                     )}
//                   />
//                 </Box>

//                 {/* UOM */}
//                 <Box mt={2}>
//                   <Stack direction="row" spacing={2}>
//                     <Controller
//                       name="uom"
//                       control={control}
//                       render={({ field }) => (
//                         <TextField {...field} label="UOM" required />
//                       )}
//                     />
//                     <Controller
//                       name="uomQuantity"
//                       control={control}
//                       render={({ field }) => (
//                         <TextField {...field} label="Số lượng/UOM" required />
//                       )}
//                     />
//                   </Stack>
//                 </Box>

//                 {/* GTIN */}
//                 <Box mt={2}>
//                   <Controller
//                     name="gtin"
//                     control={control}
//                     render={({ field }) => (
//                       <TextField {...field} label="GTIN" fullWidth required />
//                     )}
//                   />
//                 </Box>

//                 {/* Active Ingredients */}
//                 <Box mt={2}>
//                   <InputLabel>Hoạt chất</InputLabel>
//                   {activeFields.map((item, index) => (
//                     <Stack direction="row" spacing={1} key={item.id} mt={1}>
//                       <Controller
//                         name={`activeIngredient.${index}.name`}
//                         control={control}
//                         render={({ field }) => (
//                           <TextField {...field} label="Tên" required />
//                         )}
//                       />
//                       <Controller
//                         name={`activeIngredient.${index}.strength`}
//                         control={control}
//                         render={({ field }) => (
//                           <TextField {...field} label="Hàm lượng" required />
//                         )}
//                       />
//                       <Controller
//                         name={`activeIngredient.${index}.route`}
//                         control={control}
//                         render={({ field }) => (
//                           <Select {...field} required>
//                             {[
//                               "oral",
//                               "injection",
//                               "IV infusion",
//                               "inhalation",
//                               "rectal insertion",
//                             ].map((r) => (
//                               <MenuItem key={r} value={r}>
//                                 {r}
//                               </MenuItem>
//                             ))}
//                           </Select>
//                         )}
//                       />
//                       <Button onClick={() => removeActive(index)}>X</Button>
//                     </Stack>
//                   ))}
//                   <Button
//                     onClick={() =>
//                       appendActive({ name: "", strength: "", route: "oral" })
//                     }
//                   >
//                     + Thêm hoạt chất
//                   </Button>
//                 </Box>

//                 {/* Storage Conditions */}
//                 <Box mt={2}>
//                   <InputLabel>Điều kiện bảo quản</InputLabel>
//                   {storageFields.map((item, index) => (
//                     <Stack direction="row" spacing={1} key={item.id} mt={1}>
//                       <Controller
//                         name={`storageConditions.${index}.temperature`}
//                         control={control}
//                         render={({ field }) => (
//                           <TextField {...field} label="Nhiệt độ" required />
//                         )}
//                       />
//                       <Controller
//                         name={`storageConditions.${index}.humidity`}
//                         control={control}
//                         render={({ field }) => (
//                           <TextField {...field} label="Độ ẩm" required />
//                         )}
//                       />
//                       <Controller
//                         name={`storageConditions.${index}.type`}
//                         control={control}
//                         render={({ field }) => (
//                           <Select {...field} required>
//                             {["domestic", "abroad"].map((t) => (
//                               <MenuItem key={t} value={t}>
//                                 {t}
//                               </MenuItem>
//                             ))}
//                           </Select>
//                         )}
//                       />
//                       <Button onClick={() => removeStorage(index)}>X</Button>
//                     </Stack>
//                   ))}
//                   <Button
//                     onClick={() =>
//                       appendStorage({
//                         temperature: "",
//                         humidity: "",
//                         type: "domestic",
//                       })
//                     }
//                   >
//                     + Thêm điều kiện
//                   </Button>
//                 </Box>
//               </Grid>

//               {/* Right: Images */}
//               <Grid size={{ xs: 12, sm: 4 }}>
//                 {/* Right: Images */}
//                 <Grid size={{ xs: 12, sm: 4 }}>
//                   {mode === "editImage" && (
//                     <Box mt={2}>
//                       <Controller
//                         name="imagePrimary"
//                         control={control}
//                         render={({ field }) => (
//                           <>
//                             <InputLabel>Ảnh đại diện</InputLabel>
//                             <input
//                               type="file"
//                               accept="image/*"
//                               onChange={(e) =>
//                                 setValue(
//                                   "imagePrimary",
//                                   e.target.files ? e.target.files[0] : null
//                                 )
//                               }
//                             />
//                             {field.value && (
//                               <small>Đã chọn: {field.value.name}</small>
//                             )}
//                           </>
//                         )}
//                       />
//                     </Box>
//                   )}

//                   {/* Ảnh phụ (luôn hiển thị cho create/edit/editImage) */}
//                   {mode === "edit" || mode === "create" && (
//                   <Box mt={2}>
//                     <Controller
//                       name="images"
//                       control={control}
//                       render={({ field }) => (
//                         <>
//                           <InputLabel>Ảnh sản phẩm</InputLabel>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             multiple
//                             onChange={(e) =>
//                               setValue(
//                                 "images",
//                                 e.target.files ? Array.from(e.target.files) : []
//                               )
//                             }
//                           />
//                           {field.value.length > 0 && (
//                             <small>Đã chọn: {field.value.length} ảnh</small>
//                           )}
//                         </>
//                       )}
//                     />
//                   </Box>
//                    )}
//                 </Grid>
//               </Grid>
//             </Grid>
//           </Paper>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={onClose}>Hủy</Button>
//           <Button type="submit" variant="contained">
//             Lưu thuốc (Draft)
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// }


"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Stack,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Box,
  Paper,
  Fade,
} from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { TransitionProps } from "@mui/material/transitions";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import successAnimation from "@/assets/animations/success.json";
import { useCategoriesByStatus } from "@/hooks/database/useCategory";
import { backendService } from "@/services/drugService";
import toast from "react-hot-toast";

// ============================
// Transition Component
// ============================
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

export type ActiveIngredient = {
  name: string;
  strength: string;
  route:
    | "oral"
    | "injection"
    | "IV infusion"
    | "inhalation"
    | "rectal insertion";
};

export type StorageCondition = {
  temperature: string;
  humidity: string;
  type: "domestic" | "abroad";
};

export type FormValues = {
  _id: string;
  name: string;
  description: string;
  categoryIds: string[];
  images: File[];
  imagePrimary: File | null;
  uom: string;
  uomQuantity: number;
  gtin: string;
  activeIngredient: ActiveIngredient[];
  storageConditions: StorageCondition[];
};

export type DrugFormProps = {
  open: boolean;
  onClose: () => void;
  initial?: FormValues | null;
  onSaved?: () => void;
  mode?: "create" | "edit" | "editImage";
};

export default function DrugForm({
  open,
  onClose,
  initial,
  onSaved,
  mode = "create",
}: DrugFormProps) {
  const { control, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      categoryIds: [],
      images: [],
      imagePrimary: null,
      uom: "",
      uomQuantity: 0,
      gtin: "",
      activeIngredient: [],
      storageConditions: [],
    },
  });

  // giữ lại để cleanup
  const isMounted = useRef(true);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  const { fields: activeFields, append: appendActive, remove: removeActive } =
    useFieldArray({ control, name: "activeIngredient" });

  const {
    fields: storageFields,
    append: appendStorage,
    remove: removeStorage,
  } = useFieldArray({ control, name: "storageConditions" });

  const { data: categories } = useCategoriesByStatus(true);

  useEffect(() => {
    if (initial) reset(initial);
  }, [initial, reset]);

  // cleanup khi unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const handleSuccess = () => {
    setShowSuccessAnim(true);
    setTimeout(() => {
      if (!isMounted.current) return;
      setShowSuccessAnim(false);
      onSaved?.();
      onClose();
    }, 1500);
  };

  const handleError = () => toast.error("❌ Lưu thất bại!");

  const onSubmit = async (data: FormValues) => {
    const userId = getCookie("userId");
    if (!userId) {
      toast.error("Cookie userId chưa tồn tại.");
      return;
    }

    try {
      const formData = new FormData();

      if (mode === "create") {
        formData.append("name", data.name.trim());
        formData.append("description", data.description);
        formData.append("uom", data.uom);
        formData.append("uomQuantity", String(data.uomQuantity));
        formData.append("gtin", data.gtin);
        formData.append("isActive", "draft");
        formData.append("createdBy", userId);

        data.categoryIds.forEach((id) => formData.append("categoryIds[]", id));
        formData.append("activeIngredient", JSON.stringify(data.activeIngredient));
        formData.append("storageConditions", JSON.stringify(data.storageConditions));

        if (data.images.length > 0) {
          data.images.forEach((file) => formData.append("images", file));
        }

        await backendService.createProduct(formData);
        toast.success("✅ Đã tạo thuốc dạng draft!");
      } else if (mode === "edit") {
        formData.append("productId", initial!._id!);
        formData.append("name", data.name.trim());
        formData.append("description", data.description);
        formData.append("uom", data.uom);
        formData.append("uomQuantity", String(data.uomQuantity));
        formData.append("gtin", data.gtin);
        formData.append("activeIngredient", JSON.stringify(data.activeIngredient));
        formData.append("storageConditions", JSON.stringify(data.storageConditions));
        data.categoryIds.forEach((id) => formData.append("categoryIds[]", id));

        if (data.imagePrimary) {
          formData.append("imagePrimary", data.imagePrimary);
        }
        if (data.images.length > 0) {
          data.images.forEach((file) => formData.append("images", file));
        }

        await backendService.updateProduct(formData);
        toast.success("✅ Đã cập nhật thuốc!");
      } else if (mode === "editImage") {
        if (!initial?._id || !data.imagePrimary)
          throw new Error("Thiếu dữ liệu để update ảnh");
        await backendService.updatePrimaryImage(initial._id, data.imagePrimary);
        toast.success("✅ Đã cập nhật ảnh thuốc!");
      }

      handleSuccess();
    } catch (err) {
      console.error(err);
      handleError();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        TransitionComponent={Transition}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              key="drug-form"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3 }}
            >
              <DialogTitle>
                {mode === "edit"
                  ? "Sửa thuốc"
                  : mode === "editImage"
                  ? "Sửa ảnh thuốc"
                  : "Thêm thuốc"}{" "}
                (Draft)
              </DialogTitle>

              <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      {/* LEFT */}
                      <Grid size={{ xs: 12, sm: 8 }}>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => (
                            <TextField {...field} label="Tên thuốc" fullWidth required />
                          )}
                        />

                        <Box mt={2}>
                          <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Mô tả"
                                fullWidth
                                multiline
                                rows={3}
                              />
                            )}
                          />
                        </Box>

                        <Box mt={2}>
                          <Controller
                            name="categoryIds"
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <InputLabel>Danh mục</InputLabel>
                                <Select {...field} multiple>
                                  {categories?.map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>
                                      {cat.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Box>

                        <Box mt={2}>
                          <Stack direction="row" spacing={2}>
                            <Controller
                              name="uom"
                              control={control}
                              render={({ field }) => (
                                <TextField {...field} label="UOM" required />
                              )}
                            />
                            <Controller
                              name="uomQuantity"
                              control={control}
                              render={({ field }) => (
                                <TextField {...field} label="Số lượng/UOM" required />
                              )}
                            />
                          </Stack>
                        </Box>

                        <Box mt={2}>
                          <Controller
                            name="gtin"
                            control={control}
                            render={({ field }) => (
                              <TextField {...field} label="GTIN" fullWidth required />
                            )}
                          />
                        </Box>

                        {/* Active Ingredients */}
                        <Box mt={2}>
                          <InputLabel>Hoạt chất</InputLabel>
                          {activeFields.map((item, index) => (
                            <Stack direction="row" spacing={1} key={item.id} mt={1}>
                              <Controller
                                name={`activeIngredient.${index}.name`}
                                control={control}
                                render={({ field }) => (
                                  <TextField {...field} label="Tên" required />
                                )}
                              />
                              <Controller
                                name={`activeIngredient.${index}.strength`}
                                control={control}
                                render={({ field }) => (
                                  <TextField {...field} label="Hàm lượng" required />
                                )}
                              />
                              <Controller
                                name={`activeIngredient.${index}.route`}
                                control={control}
                                render={({ field }) => (
                                  <Select {...field} required>
                                    {[
                                      "oral",
                                      "injection",
                                      "IV infusion",
                                      "inhalation",
                                      "rectal insertion",
                                    ].map((r) => (
                                      <MenuItem key={r} value={r}>
                                        {r}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                )}
                              />
                              <Button onClick={() => removeActive(index)}>X</Button>
                            </Stack>
                          ))}
                          <Button
                            onClick={() =>
                              appendActive({ name: "", strength: "", route: "oral" })
                            }
                          >
                            + Thêm hoạt chất
                          </Button>
                        </Box>

                        {/* Storage Conditions */}
                        <Box mt={2}>
                          <InputLabel>Điều kiện bảo quản</InputLabel>
                          {storageFields.map((item, index) => (
                            <Stack direction="row" spacing={1} key={item.id} mt={1}>
                              <Controller
                                name={`storageConditions.${index}.temperature`}
                                control={control}
                                render={({ field }) => (
                                  <TextField {...field} label="Nhiệt độ" required />
                                )}
                              />
                              <Controller
                                name={`storageConditions.${index}.humidity`}
                                control={control}
                                render={({ field }) => (
                                  <TextField {...field} label="Độ ẩm" required />
                                )}
                              />
                              <Controller
                                name={`storageConditions.${index}.type`}
                                control={control}
                                render={({ field }) => (
                                  <Select {...field} required>
                                    {["domestic", "abroad"].map((t) => (
                                      <MenuItem key={t} value={t}>
                                        {t}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                )}
                              />
                              <Button onClick={() => removeStorage(index)}>X</Button>
                            </Stack>
                          ))}
                          <Button
                            onClick={() =>
                              appendStorage({
                                temperature: "",
                                humidity: "",
                                type: "domestic",
                              })
                            }
                          >
                            + Thêm điều kiện
                          </Button>
                        </Box>
                      </Grid>

                      {/* RIGHT */}
                      <Grid size={{ xs: 12, sm: 4 }}>
                        {mode === "editImage" && (
                          <Box mt={2}>
                            <Controller
                              name="imagePrimary"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <InputLabel>Ảnh đại diện</InputLabel>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      setValue(
                                        "imagePrimary",
                                        e.target.files ? e.target.files[0] : null
                                      )
                                    }
                                  />
                                  {field.value && (
                                    <small>Đã chọn: {field.value.name}</small>
                                  )}
                                </>
                              )}
                            />
                          </Box>
                        )}

                        {(mode === "edit" || mode === "create") && (
                          <Box mt={2}>
                            <Controller
                              name="images"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <InputLabel>Ảnh sản phẩm</InputLabel>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) =>
                                      setValue(
                                        "images",
                                        e.target.files
                                          ? Array.from(e.target.files)
                                          : []
                                      )
                                    }
                                  />
                                  {field.value.length > 0 && (
                                    <small>Đã chọn: {field.value.length} ảnh</small>
                                  )}
                                </>
                              )}
                            />
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Paper>
                </DialogContent>

                <DialogActions>
                  <Button onClick={onClose}>Hủy</Button>
                  <Button type="submit" variant="contained">
                    Lưu thuốc (Draft)
                  </Button>
                </DialogActions>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>

      {showSuccessAnim && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 200,
            zIndex: 9999,
          }}
        >
          <Lottie animationData={successAnimation} loop={false} />
        </Box>
      )}
    </>
  );
}
