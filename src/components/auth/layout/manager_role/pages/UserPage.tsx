
// "use client";

// import { useState } from "react";
// import { getCookie } from "cookies-next";
// import { Box, Button, Typography } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";

// import UserTable from "../widgets/UserTable";
// import UserForm from "../widgets/UserForm";

// import {
//   useUsers,
//   useLockUser,
//   useDeleteUser,
//   useRoles,
//   usePermissionsByType,
//   useCreateUser,
// } from "@/hooks/useStaff";
// import { User } from "@/types/staff";

// export default function UserPage() {
//   const { data: users = [], refetch } = useUsers();
//   const { data: roles = [] } = useRoles();
//   const { data: permissions = [] } = usePermissionsByType();

//   const lockUser = useLockUser();
//   const deleteUser = useDeleteUser();
//   const createUser = useCreateUser();

//   const [openForm, setOpenForm] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   // Lấy user từ cookie
//   const userCookie = getCookie("user");
//   let finalUsers = users;
//   if (userCookie) {
//     try {
//       const currentUser = JSON.parse(userCookie as string);
//       if (!users.find((u) => u._id === currentUser.id)) {
//         finalUsers = [currentUser, ...users];
//       }
//     } catch (e) {
//       console.error("Parse user cookie failed", e);
//     }
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header + Thêm User */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           mb: 2,
//           alignItems: "center",
//         }}
//       >
//         <Typography variant="h5" sx={{ fontWeight: "bold" }}>
//           Quản lý nhân viên
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           sx={{
//             borderRadius: 2,
//             textTransform: "none",
//             bgcolor: "#4FC3F7",
//             "&:hover": { bgcolor: "#29B6F6" },
//           }}
//           onClick={() => setOpenForm(true)}
//         >
//           Thêm User
//         </Button>
//       </Box>

//       {/* Bảng user */}
//       <UserTable
//         users={finalUsers}
//         roles={roles}
//         onAssign={(user) => setSelectedUser(user)}
//         onLock={(payload) =>
//           lockUser.mutate(payload, { onSuccess: () => refetch() })
//         }
//         onDelete={(id) => deleteUser.mutate(id, { onSuccess: () => refetch() })}
//       />

//       {/* Form thêm/cập nhật user */}
//       {/* <UserForm
//         open={openForm}
//         onClose={() => setOpenForm(false)}
//         roles={roles}
//         permissions={permissions}
//         onSubmit={(data) =>
//           createUser.mutate(data, {
//             onSuccess: () => {
//               refetch();
//               setOpenForm(false);
//             },
//           })
//         }
//       /> */}
//       <UserForm
//   open={!!selectedUser || openForm} // mở form nếu có selectedUser
//   initialUser={selectedUser}       // truyền dữ liệu user để edit
//   onClose={() => setSelectedUser(null)} // reset khi đóng form
//   roles={roles}
//   permissions={permissions}
//   onSubmit={(data) => {
//     createUser.mutate(data, {
//       onSuccess: () => {
//         refetch();
//         setSelectedUser(null);
//       },
//     });
//   }}
// />

//     </Box>
//   );
// }


// "use client";

// import { useState } from "react";
// import { getCookie } from "cookies-next";
// import { Box, Button, Typography } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";

// import UserTable from "../widgets/UserTable";
// import UserForm from "../widgets/UserForm";

// import {
//   useUsers,
//   useLockUser,
//   useDeleteUser,
//   useRoles,
//   usePermissionsByType,
//   useCreateUser,
// } from "@/hooks/useStaff";
// import { User } from "@/types/staff";

// export default function UserPage() {
//   const { data: users = [], refetch } = useUsers();
//   const { data: roles = [] } = useRoles();
//   const { data: permissions = [] } = usePermissionsByType();

//   const lockUser = useLockUser();
//   const deleteUser = useDeleteUser();
//   const createUser = useCreateUser();

//   const [openForm, setOpenForm] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   // Lấy user từ cookie
//   const userCookie = getCookie("user");
//   let finalUsers = users;
//   if (userCookie) {
//     try {
//       const currentUser = JSON.parse(userCookie as string);
//       if (!users.find((u) => u._id === currentUser.id)) {
//         finalUsers = [currentUser, ...users];
//       }
//     } catch (e) {
//       console.error("Parse user cookie failed", e);
//     }
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header + Thêm User */}
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           mb: 2,
//           alignItems: "center",
//         }}
//       >
//         <Typography variant="h5" sx={{ fontWeight: "bold" }}>
//           Quản lý nhân viên
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           sx={{
//             borderRadius: 2,
//             textTransform: "none",
//             bgcolor: "#4FC3F7",
//             "&:hover": { bgcolor: "#29B6F6" },
//           }}
//           onClick={() => setOpenForm(true)}
//         >
//           Thêm User
//         </Button>
//       </Box>

//       {/* Bảng user */}
//       <UserTable
//         users={finalUsers}
//         roles={roles}
//         onAssign={(user) => setSelectedUser(user)}
//         onLock={(payload) =>
//           lockUser.mutate(payload, { onSuccess: () => refetch() })
//         }
//         onDelete={(id) => deleteUser.mutate(id, { onSuccess: () => refetch() })}
//       />

//       {/* Form thêm/cập nhật user */}
//       <UserForm
//         open={!!selectedUser || openForm}
//         initialUser={selectedUser}
//         onClose={() => {
//           setSelectedUser(null);
//           setOpenForm(false);
//         }}
//         roles={roles}
//         permissions={permissions}
//         onSubmit={(data) => {
//           createUser.mutate(data, {
//             onSuccess: () => {
//               refetch();
//               setOpenForm(false);
//               setSelectedUser(null);
//             },
//           });
//         }}
//       />
//     </Box>
//   );
// }


"use client";

import { useState } from "react";
import { getCookie } from "cookies-next";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import UserTable from "../widgets/UserTable";
import UserForm from "../widgets/UserForm";

import {
  useUsers,
  useCreateUser,
  useLockUser,
  useDeleteUser,
  useRoles,
  usePermissionsByType,
} from "@/hooks/database/useStaff";
import { CreateUserRequest, User } from "@/types/staff";

export default function UserPage() {
  const { data: users = [], refetch } = useUsers();
  const { data: roles = [] } = useRoles();
  const { data: permissions = [] } = usePermissionsByType();

  const createUser = useCreateUser();
  const lockUser = useLockUser();
  const deleteUser = useDeleteUser();

  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Cookie user
  const userCookie = getCookie("user");
  let finalUsers = users;
  if (userCookie) {
    try {
      const currentUser = JSON.parse(userCookie as string);
      if (!users.find((u) => u._id === currentUser.id)) {
        finalUsers = [currentUser, ...users];
      }
    } catch (e) {
      console.error("Parse user cookie failed", e);
    }
  }

  // Xử lý submit user từ form
  const handleSubmitUser = (data: CreateUserRequest & { userId?: string }) => {
  createUser.mutate(data, {
    onSuccess: () => {
      refetch();
      setOpenForm(false);
      setSelectedUser(null);
    },
  });
};


  return (
    <Box sx={{ p: 3 }}>
      {/* Header + Thêm User */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Quản lý nhân viên
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, textTransform: "none", bgcolor: "#4FC3F7", "&:hover": { bgcolor: "#29B6F6" } }}
          onClick={() => setOpenForm(true)}
        >
          Thêm User
        </Button>
      </Box>

      {/* Bảng user */}
      <UserTable
        users={finalUsers}
        roles={roles}
        permissions={permissions}
        onAssign={(user) => setSelectedUser(user)}
        onLock={(payload) => lockUser.mutate(payload, { onSuccess: () => refetch() })}
        onDelete={(id) => deleteUser.mutate(id, { onSuccess: () => refetch() })}
      />

      {/* Form thêm/cập nhật user */}
      <UserForm
        open={!!selectedUser || openForm}
        initialUser={selectedUser}
        roles={roles}
        permissions={permissions}
        onClose={() => {
          setSelectedUser(null);
          setOpenForm(false);
        }}
        onSubmit={handleSubmitUser}
      />
    </Box>
  );
}
