// "use client";

// import { Role, User } from "@/types/staff";
// import { Table, TableBody, TableCell, TableHead, TableRow, Button, Chip, Paper } from "@mui/material";

// type Props = {
//   users: User[];
//   roles: Role[];
//   onAssign: (user: User) => void;
//   onLock?: (userId: string) => void;
//   onDelete?: (userId: string) => void;
// };

// export default function UserTable({ users, roles, onAssign, onLock, onDelete }: Props) {
//   const findRoleName = (id: string) => roles.find((r) => r.id === id)?.displayName ?? id;

//   return (
//     <Paper sx={{ borderRadius: 3, overflowX: "auto", p: 1 }}>
//       <Table>
//         <TableHead sx={{ bgcolor: "#BBDEFB" }}>
//           <TableRow>
//             <TableCell sx={{ fontWeight: "bold" }}>UserName</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Roles</TableCell>
//             <TableCell sx={{ fontWeight: "bold" }}>Hành động</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {users.map((u) => (
//             <TableRow key={u.id} sx={{ "&:hover": { bgcolor: "#E3F2FD" }, transition: "0.2s" }}>
//               <TableCell>{u.userName}</TableCell>
//               <TableCell>{u.email}</TableCell>
//               <TableCell>{u.phone}</TableCell>
//               <TableCell>
//                 <Chip
//                   label={u.isActive ? "Active" : "Locked"}
//                   color={u.isActive ? "success" : "error"}
//                   sx={{ borderRadius: 2 }}
//                 />
//               </TableCell>
//               <TableCell>
//                 {u.roleIds?.map((rId) => (
//                   <Chip
//                     key={rId}
//                     label={findRoleName(rId)}
//                     sx={{ mr: 1, mb: 1, bgcolor: "#E8F5E9", borderRadius: 2 }}
//                   />
//                 ))}
//               </TableCell>
//               <TableCell>
//                 {onLock && (
//                   <Button
//                     variant="outlined"
//                     sx={{ mr: 1, borderRadius: 2, textTransform: "none" }}
//                     onClick={() => onLock(u.id)}
//                   >
//                     Khóa
//                   </Button>
//                 )}
//                 {onDelete && (
//                   <Button
//                     color="error"
//                     variant="outlined"
//                     sx={{ mr: 1, borderRadius: 2, textTransform: "none" }}
//                     onClick={() => onDelete(u.id)}
//                   >
//                     Xóa
//                   </Button>
//                 )}
//                 <Button
//                   color="primary"
//                   variant="outlined"
//                   sx={{ borderRadius: 2, textTransform: "none" }}
//                   onClick={() => onAssign(u)}
//                 >
//                   Gán quyền
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </Paper>
//   );
// }

// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Paper,
//   Tooltip,
// } from "@mui/material";
// import { User, Role } from "@/types/staff";
// import LockIcon from "@mui/icons-material/Lock";
// import LockOpenIcon from "@mui/icons-material/LockOpen";
// import DeleteIcon from "@mui/icons-material/Delete";

// type Props = {
//   users: User[];
//   roles: Role[];
//   onAssign: (user: User) => void;
//   onLock: (payload: { userId: string; isActive: boolean }) => void;
//   onDelete: (userId: string) => void;
// };

// export default function UserTable({ users, roles, onAssign, onLock, onDelete }: Props) {
//   return (
//     <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell><b>Tên</b></TableCell>
//             <TableCell><b>Email</b></TableCell>
//             <TableCell><b>Phone</b></TableCell>
//             <TableCell><b>Roles</b></TableCell>
//             <TableCell><b>Trạng thái</b></TableCell>
//             <TableCell align="right"><b>Hành động</b></TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {users.map((user) => {
//             // đảm bảo roleId luôn là mảng
//             const userRoleIds = Array.isArray(user.roleId) ? user.roleId : user.roleId ? [user.roleId] : [];

//             // lọc role tương ứng
//             const userRoles = roles.filter((r) => userRoleIds.includes(r._id));

//             return (
//               <TableRow key={user._id}>
//                 <TableCell>{user.userName}</TableCell>
//                 <TableCell>{user.email}</TableCell>
//                 <TableCell>{user.phone}</TableCell>
//                 <TableCell>
//                   {userRoles.length > 0
//                     ? userRoles.map((r) => r.displayName).join(", ")
//                     : "Chưa có role"}
//                 </TableCell>
//                 <TableCell>{user.isActive ? "Hoạt động" : "Bị khóa"}</TableCell>
//                 <TableCell align="right">
//                   <Tooltip title={user.isActive ? "Khóa user" : "Mở khóa user"}>
//                     <IconButton
//                       color="primary"
//                       onClick={() =>
//                         onLock({ userId: user._id, isActive: !user.isActive })
//                       }
//                     >
//                       {user.isActive ? <LockIcon /> : <LockOpenIcon />}
//                     </IconButton>
//                   </Tooltip>
//                   <Tooltip title="Xóa user">
//                     <IconButton color="error" onClick={() => onDelete(user._id)}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </Tooltip>
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Paper,
//   Tooltip,
//   Chip,
//   Stack,
// } from "@mui/material";
// import LockIcon from "@mui/icons-material/Lock";
// import LockOpenIcon from "@mui/icons-material/LockOpen";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { User, Role, PermissionType } from "@/types/staff";

// type Props = {
//   users: User[];
//   roles: Role[];
//   permissions?: PermissionType[]; // tùy chọn nếu muốn hiển thị
//   onAssign: (user: User) => void;
//   onLock: (payload: { userId: string; isActive: boolean }) => void;
//   onDelete: (userId: string) => void;
// };

// export default function UserTable({
//   users,
//   roles,
//   permissions,
//   onAssign,
//   onLock,
//   onDelete,
// }: Props) {
//   return (
//     <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell><b>Tên</b></TableCell>
//             <TableCell><b>Email</b></TableCell>
//             <TableCell><b>Phone</b></TableCell>
//             <TableCell><b>Roles</b></TableCell>
//             {permissions && <TableCell><b>Permissions</b></TableCell>}
//             <TableCell><b>Trạng thái</b></TableCell>
//             <TableCell align="right"><b>Hành động</b></TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {users.map((user) => {
//             const userRoleIds = Array.isArray(user.roleId)
//   ? user.roleId
//   : user.roleId
//   ? [user.roleId]
//   : [];

//             const userRoles = roles.filter((r) => userRoleIds.includes(r._id));

//             const userPermissionIds = Array.isArray(user.permissionIds)
//               ? user.permissionIds
//               : user.permissionIds
//               ? [user.permissionIds]
//               : [];

//             const userPermissions = permissions?.filter((p) =>
//               userPermissionIds.includes(p._id)
//             );

//             return (
//               <TableRow key={user._id}>
//                 <TableCell>{user.userName}</TableCell>
//                 <TableCell>{user.email}</TableCell>
//                 <TableCell>{user.phone}</TableCell>
//                 <TableCell>
//                   {userRoles.length > 0
//                     ? userRoles.map((r) => r.displayName).join(", ")
//                     : "Chưa có role"}
//                 </TableCell>
//                 {permissions && (
//                   <TableCell>
//                     {userPermissions && userPermissions.length > 0 ? (
//                       <Stack direction="row" spacing={0.5} flexWrap="wrap">
//                         {userPermissions.map((p) => (
//                           <Chip
//                             key={p._id}
//                             label={p.displayName}
//                             size="small"
//                             color="primary"
//                           />
//                         ))}
//                       </Stack>
//                     ) : (
//                       "Chưa có permission"
//                     )}
//                   </TableCell>
//                 )}
//                 <TableCell>{user.isActive ? "Hoạt động" : "Bị khóa"}</TableCell>
//                 <TableCell align="right">
//                   <Tooltip title={user.isActive ? "Khóa user" : "Mở khóa user"}>
//                     <IconButton
//                       color="primary"
//                       onClick={() =>
//                         onLock({ userId: user._id, isActive: !user.isActive })
//                       }
//                     >
//                       {user.isActive ? <LockIcon /> : <LockOpenIcon />}
//                     </IconButton>
//                   </Tooltip>
//                   <Tooltip title="Xóa user">
//                     <IconButton color="error" onClick={() => onDelete(user._id)}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </Tooltip>
//                 </TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Tooltip,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // 👈 thêm icon chỉnh sửa

import { User, Role, PermissionType } from "@/types/staff";

type Props = {
  users: User[];
  roles: Role[];
  permissions?: PermissionType[];
  onAssign: (user: User) => void; // dùng khi bấm nút "sửa"
  onLock: (payload: { userId: string; isActive: boolean }) => void;
  onDelete: (userId: string) => void;
};

export default function UserTable({
  users,
  roles,
  permissions,
  onAssign,
  onLock,
  onDelete,
}: Props) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Tên</b>
            </TableCell>
            <TableCell>
              <b>Email</b>
            </TableCell>
            <TableCell>
              <b>Phone</b>
            </TableCell>
            <TableCell>
              <b>Roles</b>
            </TableCell>
            {permissions && (
              <TableCell>
                <b>Permissions</b>
              </TableCell>
            )}
            <TableCell>
              <b>Trạng thái</b>
            </TableCell>
            <TableCell align="right">
              <b>Hành động</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => {
            // Chắc chắn roleId là string, không phải mảng
            const roleId = Array.isArray(user.roleId)
              ? user.roleId[0]
              : user.roleId;

            const userRole = roles.find((r) => r._id === roleId);

            return (
              <TableRow key={user._id}>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  {userRole ? userRole.displayName : "Chưa có role"}
                </TableCell>
                {permissions && (
                  <TableCell>{/* Permission xử lý sau */}</TableCell>
                )}
                <TableCell>{user.isActive ? "Hoạt động" : "Bị khóa"}</TableCell>

                {/* Nút hành động */}
                <TableCell align="right">
                  {/* 🔧 Nút sửa / phân quyền */}
                  <Tooltip title="Sửa / Phân quyền">
                    <IconButton
                      color="secondary"
                      onClick={() => onAssign(user)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>

                  {/* 🔒 Nút khóa / mở khóa */}
                  <Tooltip title={user.isActive ? "Khóa user" : "Mở khóa user"}>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        onLock({
                          userId: user._id,
                          isActive: !user.isActive,
                        })
                      }
                    >
                      {user.isActive ? <LockIcon /> : <LockOpenIcon />}
                    </IconButton>
                  </Tooltip>

                  {/* 🗑️ Nút xóa */}
                  <Tooltip title="Xóa user">
                    <IconButton
                      color="error"
                      onClick={() => onDelete(user._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
