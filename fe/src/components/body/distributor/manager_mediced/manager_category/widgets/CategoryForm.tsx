"use client";

import { Box, Button, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import successAnimation from "@/assets/animations/success.json";
import { useState } from "react";
// import { Role } from "@/types/role";
import {
  Category,
  CategoryCreatePayload,
  CategoryUpdatePayload,
} from "@/types/category";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/database/useCategory";
import { Role } from "@/types/role";

interface CategoryFormProps {
  role: Role;
  canCreate: boolean;
  canEdit: boolean;
  category?: Category | null;
  onClose: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

export default function CategoryForm({
  role,
  canCreate,
  canEdit,
  category,
  onClose,
  onSuccess,
  onError,
}: CategoryFormProps) {
  const { control, handleSubmit } = useForm<CategoryCreatePayload>({
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  // Quyền check
  if (!canCreate && !category) return null; // không có quyền tạo
  if (category && !canEdit) return null; // không có quyền edit

  const handleSuccess = () => {
    setShowSuccessAnim(true);
    setTimeout(() => {
      setShowSuccessAnim(false);
      onClose();
      onSuccess?.();
    }, 1500);
  };

  const handleError = () => onError?.();

  const onSubmit = (data: CategoryCreatePayload) => {
    console.log("role", role);

    if (category) {
      const payload: CategoryUpdatePayload = {
        ...data,
        categoryId: category._id,
      };
      updateMutation.mutate(payload, {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: handleSuccess,
        onError: handleError,
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          style={{ position: "relative", zIndex: 1000 }}
        >
          <Box
            sx={{
              p: 3,
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 3,
              width: 400,
            }}
          >
            <Typography variant="h6" mb={2}>
              {category ? "Sửa danh mục" : "Thêm danh mục"}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Tên danh mục bắt buộc" }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Tên danh mục"
                    fullWidth
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Mô tả"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                  />
                )}
              />
              <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" type="submit">
                  {category ? "Cập nhật" : "Tạo"}
                </Button>
              </Box>
            </form>
          </Box>
        </motion.div>
      </AnimatePresence>

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
