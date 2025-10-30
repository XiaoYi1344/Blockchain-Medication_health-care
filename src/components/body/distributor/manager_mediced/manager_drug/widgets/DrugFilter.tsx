// components/body/distributor/manager_mediced/manager_drug/widgets/DrugFilter.tsx
"use client";

import React, { useState } from "react";
import { Box, TextField, MenuItem, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { DrugFilterValues } from "@/types/drug";

interface DrugFilterProps {
  value?: DrugFilterValues;
  categories?: string[];
  onChange?: (values: DrugFilterValues) => void;
  onReset?: () => void;
}

export default function DrugFilter({
  value,
  categories = [],
  onChange,
  onReset,
}: DrugFilterProps) {
  const [values, setValues] = useState<DrugFilterValues>(value || {});

  const mountedRef = React.useRef(true);

React.useEffect(() => {
  mountedRef.current = true;
  return () => {
    mountedRef.current = false;
  };
}, []);

React.useEffect(() => {
  if (mountedRef.current) setValues(value || {});
}, [value]);


  const handleChange = <K extends keyof DrugFilterValues>(
    field: K,
    value: DrugFilterValues[K]
  ) => {
    const newValues = { ...values, [field]: value };
    setValues(newValues);
    onChange?.(newValues);
  };

  const handleReset = () => {
    setValues({});
    onReset?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        mb={2}
        alignItems="center"
        sx={{ background: "#f9f9f9", p: 2, borderRadius: 2 }}
      >
        <TextField
          label="Tên thuốc"
          size="small"
          value={values.name || ""}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <TextField
          label="Mã công ty"
          size="small"
          value={values.companyCode || ""}
          onChange={(e) => handleChange("companyCode", e.target.value)}
        />
        <TextField
          select
          label="Danh mục"
          size="small"
          value={values.category || ""}
          onChange={(e) => handleChange("category", e.target.value)}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Trạng thái"
          size="small"
          value={values.status || ""}
          onChange={(e) =>
            handleChange(
              "status",
              e.target.value === ""
                ? undefined
                : (e.target.value as "draft" | "pending" | "approved")
            )
          }
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          <MenuItem value="draft">Chưa gửi</MenuItem>
          <MenuItem value="pending">Chờ duyệt</MenuItem>
          <MenuItem value="approved">Đã duyệt</MenuItem>
        </TextField>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
        </Stack>
      </Box>
    </motion.div>
  );
}
