"use client";

import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Typography,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  ListItemText,
  Avatar,
  Modal,
  Paper,
  Stack,
  Button,
  useTheme,
  ListItemIcon,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  Notifications,
  ShoppingBag,
  LightMode,
  DarkMode,
  Menu as MenuIcon,
  Logout,
  AccountCircle,
  Settings,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  useUnreceivedOrders,
  useUpdateOrderStatus,
} from "@/hooks/database/useOrder";
import { userService } from "@/services/userService";
import { authService } from "@/services/authService";
import {
  Notification,
  notificationService,
} from "@/services/NotificationService";
import { useAccount} from "wagmi";
import { Order } from "@/types/order";
// import { useQueries } from "@tanstack/react-query";
// import { companyService } from "@/services/companyService";
import WalletModal from "./walletModal/modal";
import { useCompanyName } from "@/hooks/database/useCompany";
// import LanguageSwitcher from "./language/LanguageSwitcher";


interface NavbarProps {
  onToggleSidebar?: () => void;
  mode: "light" | "dark";
  onToggleMode: () => void;
}

export default function Navbar({
  onToggleSidebar,
  mode,
  onToggleMode,
}: NavbarProps) {
  const theme = useTheme();
  const router = useRouter();

  // ======== State ========
  const [search, setSearch] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [anchorNotif, setAnchorNotif] = useState<null | HTMLElement>(null);
  const [anchorOrder, setAnchorOrder] = useState<null | HTMLElement>(null);
  const [anchorAccount, setAnchorAccount] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotif, setLoadingNotif] = useState(true);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openOrderDetail, setOpenOrderDetail] = useState(false);
  const [openWalletModal, setOpenWalletModal] = useState(false);

  const openNotif = Boolean(anchorNotif);
  const openAccount = Boolean(anchorAccount);

  // Wagmi
  const { address, isConnected, isConnecting } = useAccount(); // useAccount provides connection state
  // const { connect, connectors } = useConnect();
  // const { disconnect } = useDisconnect();

  // ======== Orders ========
  const { data: unreceivedOrders = [], isLoading: loadingOrders } =
    useUnreceivedOrders();
  const updateOrderStatus = useUpdateOrderStatus();

  // ======== Order Name ========
  const CompanyInfo = ({
    label,
    companyId,
  }: {
    label: string;
    companyId?: string | null;
  }) => {
    const { name, isLoading } = useCompanyName(companyId);

    return (
      <Typography>
        <strong>{label}:</strong> {isLoading ? "Đang tải..." : name}
      </Typography>
    );
  };

  // ======== Effects ========
  useEffect(() => {
    let isMounted = true; // ✅ kiểm tra mount

    const fetchAvatarAndNotif = async () => {
      try {
        const data = await userService.getUser({
          headers: { "Cache-Control": "no-cache" },
        });
        if (isMounted) {
          setAvatarUrl(
            data.avatar ? `/api/avatar/${data.avatar}` : "/default-avatar.png"
          );
        }
      } catch (err) {
        console.error("Không thể tải avatar:", err);
      }

      try {
        setLoadingNotif(true);
        const notifData = await notificationService.getAllNotification();
        if (isMounted) {
          const unread = Array.isArray(notifData)
            ? notifData.filter((item) => !item.isRead)
            : [];
          setNotifications(unread);
        }
      } catch (err) {
        if (isMounted) setNotifications([]);
        console.error(err);
      } finally {
        if (isMounted) setLoadingNotif(false);
      }
    };

    fetchAvatarAndNotif();

    const interval = setInterval(fetchNotifications, 15 * 60 * 1000);

    return () => {
      isMounted = false; // 🚨 cleanup: stop setState khi unmount
      clearInterval(interval);
    };
  }, []);

  const fetchNotifications = async () => {
    setLoadingNotif(true);
    try {
      const data = await notificationService.getAllNotification();
      const unread = Array.isArray(data)
        ? data.filter((item) => !item.isRead)
        : [];
      setNotifications(unread);
    } catch {
      setNotifications([]);
    } finally {
      setLoadingNotif(false);
    }
  };

  // ======== Handlers ========
  const handleOpen =
    (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) =>
    (e: React.MouseEvent<HTMLElement>) =>
      setter(e.currentTarget);
  const handleClose =
    (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => () =>
      setter(null);

  const handleOpenDetail = (notif: Notification) => {
    setSelectedNotif(notif);
    setOpenDetail(true);
  };

  const handleCloseDetail = async () => {
    if (selectedNotif && !selectedNotif.isRead && selectedNotif._id) {
      try {
        await notificationService.markAsRead(selectedNotif._id);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === selectedNotif._id ? { ...n, isRead: true } : n
          )
        );
      } catch (err) {
        console.error(err);
      }
    }
    setOpenDetail(false);
  };

  // const handleDisconnectWallet = () => {
  //   disconnect();
  //   toast("Đã ngắt kết nối ví", { icon: "⚡", duration: 3000 });
  // };

  const handleLogout = () => {
    authService.logout();
    toast.success("Đã đăng xuất!");
    router.push("/auth/login");
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="transparent"
        sx={{
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minHeight: 64,
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* Left */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              onClick={onToggleSidebar}
              sx={{ display: { md: "none" }, color: "text.primary" }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                cursor: "pointer",
              }}
              onClick={() => router.push("/")}
            >
              MedixCare
            </Typography>
          </Box>

          {/* Middle: Search */}
          <Box
            sx={{
              flex: 1,
              maxWidth: 420,
              mx: 3,
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              backgroundColor:
                mode === "light"
                  ? "rgba(0,0,0,0.04)"
                  : "rgba(255,255,255,0.08)",
              px: 2,
              py: 0.5,
              borderRadius: 8,
            }}
          >
            <Search sx={{ mr: 1, color: "text.secondary" }} />
            <InputBase
              placeholder="Tìm kiếm thuốc, đơn hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, color: "text.primary" }}
            />
          </Box>

          {/* Right */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Theme */}
            <Tooltip
              title={
                mode === "light" ? "Chuyển Dark Mode" : "Chuyển Light Mode"
              }
            >
              <IconButton color="inherit" onClick={onToggleMode}>
                {mode === "light" ? (
                  <DarkMode sx={{ color: "text.secondary" }} />
                ) : (
                  <LightMode sx={{ color: "text.secondary" }} />
                )}
              </IconButton>
            </Tooltip>

             {/* Language Switcher */}
            {/* <LanguageSwitcher /> */}

            {/* Notifications */}
            <Tooltip title="Thông báo">
              <IconButton color="inherit" onClick={handleOpen(setAnchorNotif)}>
                <Badge
                  badgeContent={notifications.filter((n) => !n.isRead).length}
                  color="error"
                  invisible={
                    notifications.filter((n) => !n.isRead).length === 0
                  }
                >
                  <Notifications sx={{ color: "text.secondary" }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Notification Menu */}
            <Menu
              anchorEl={anchorNotif}
              open={openNotif}
              onClose={handleClose(setAnchorNotif)}
              PaperProps={{ sx: { mt: 1.5, width: 360, maxHeight: 400 } }}
            >
              <Typography sx={{ px: 2, py: 1, fontWeight: 600 }}>
                Thông báo mới
              </Typography>
              <Divider />
              {loadingNotif ? (
                <MenuItem>
                  <Typography variant="body2">Đang tải...</Typography>
                </MenuItem>
              ) : notifications.length === 0 ? (
                <MenuItem>
                  <Typography variant="body2">Không có thông báo</Typography>
                </MenuItem>
              ) : (
                notifications.map((notif) => (
                  <MenuItem
                    key={notif._id}
                    onClick={() => handleOpenDetail(notif)}
                  >
                    <ListItemText
                      primary={
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {!notif.isRead && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                              }}
                            />
                          )}
                          <Typography variant="body1">{notif.title}</Typography>
                        </Box>
                      }
                      secondary={notif.message}
                      secondaryTypographyProps={{ noWrap: true }}
                    />
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* Notification Detail Modal */}
            <Modal open={openDetail} onClose={handleCloseDetail}>
              <Paper
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: { xs: 320, sm: 400 },
                  p: 3,
                  outline: "none",
                  borderRadius: 2,
                }}
              >
                {selectedNotif && (
                  <Stack spacing={2}>
                    <Typography variant="h6">{selectedNotif.title}</Typography>
                    <Typography variant="body1">
                      {selectedNotif.message}
                    </Typography>
                    <Divider />
                    <Typography variant="body2">
                      <strong>Type:</strong> {selectedNotif.type}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Related Entity Type:</strong>{" "}
                      {selectedNotif.relatedEntityType || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Related Entity ID:</strong>{" "}
                      {selectedNotif.relatedEntityId || "N/A"}
                    </Typography>
                    <Button variant="contained" onClick={handleCloseDetail}>
                      Đóng
                    </Button>
                  </Stack>
                )}
              </Paper>
            </Modal>

            {/* Orders */}
            <Tooltip title="Đơn hàng">
              <IconButton color="inherit" onClick={handleOpen(setAnchorOrder)}>
                <Badge
                  color="primary"
                  badgeContent={unreceivedOrders.length}
                  invisible={unreceivedOrders.length === 0}
                >
                  <ShoppingBag sx={{ color: "text.secondary" }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Orders Menu */}
            <Menu
              anchorEl={anchorOrder}
              open={Boolean(anchorOrder)}
              onClose={handleClose(setAnchorOrder)}
              PaperProps={{ sx: { mt: 1.5, width: 360, maxHeight: 400 } }}
            >
              <Typography sx={{ px: 2, py: 1, fontWeight: 600 }}>
                Đơn hàng mới
              </Typography>
              <Divider />
              {loadingOrders ? (
                <MenuItem>
                  <Typography variant="body2">Đang tải...</Typography>
                </MenuItem>
              ) : unreceivedOrders.length === 0 ? (
                <MenuItem>
                  <Typography variant="body2">Không có đơn hàng mới</Typography>
                </MenuItem>
              ) : (
                unreceivedOrders.map((order: Order) => (
                  <MenuItem
                    key={order.orderCode}
                    onClick={() => {
                      setSelectedOrder(order);
                      setOpenOrderDetail(true);
                    }}
                  >
                    <ListItemText
                      primary={`#${order.orderCode} `}
                      secondary={order.status}
                    />
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* Order Detail Modal */}
            <Modal
              open={openOrderDetail}
              onClose={() => setOpenOrderDetail(false)}
            >
              <Paper
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: { xs: 340, sm: 480 },
                  p: 3,
                  outline: "none",
                  borderRadius: 2,
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                {selectedOrder && (
                  <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={700}>
                      Chi tiết đơn hàng
                    </Typography>

                    {/* Thông tin chung */}
                    <Divider />
                    <Stack spacing={1}>
                      {selectedOrder.orderCode && (
                        <Typography>
                          <strong>Mã đơn hàng:</strong>{" "}
                          {selectedOrder.orderCode}
                        </Typography>
                      )}
                      {selectedOrder.status && (
                        <Typography>
                          <strong>Trạng thái:</strong> {selectedOrder.status}
                        </Typography>
                      )}
                      {selectedOrder && (
                        <>
                          {selectedOrder.toCompanyId && (
                            <CompanyInfo
                              label="Công ty nhận"
                              companyId={selectedOrder.toCompanyId}
                            />
                          )}
                        </>
                      )}

                      {selectedOrder.completeDate && (
                        <Typography>
                          <strong>Ngày hoàn tất:</strong>{" "}
                          {new Date(selectedOrder.completeDate).toLocaleString(
                            "vi-VN"
                          )}
                        </Typography>
                      )}
                      {selectedOrder.txHash && (
                        <Typography>
                          <strong>TxHash:</strong> {selectedOrder.txHash}
                        </Typography>
                      )}
                    </Stack>

                    {/* Danh sách sản phẩm */}
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Sản phẩm:
                    </Typography>
                    {selectedOrder.products?.length ? (
                      selectedOrder.products.map((p, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            p: 1.5,
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            mb: 1,
                          }}
                        >
                          <Typography>
                            <strong>Mã sản phẩm:</strong> {p.productCode}
                          </Typography>
                          <Typography>
                            <strong>Số lượng:</strong> {p.productQuantity}
                          </Typography>

                          {Array.isArray(p.batch) && p.batch.length > 0 && (
                            <>
                              <Typography sx={{ mt: 1 }}>
                                <strong>Lô hàng:</strong>
                              </Typography>
                              {p.batch.map((b, i) => (
                                <Box key={i} sx={{ pl: 2 }}>
                                  <Typography>
                                    - Mã lô: {b.batchCode}
                                  </Typography>
                                  <Typography>
                                    - Số lượng: {b.quantity}
                                  </Typography>
                                  {b.locationId && (
                                    <Typography>
                                      - Vị trí: {b.locationId}
                                    </Typography>
                                  )}
                                </Box>
                              ))}
                            </>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Typography color="text.secondary">
                        Không có thông tin sản phẩm
                      </Typography>
                    )}

                    <Divider sx={{ my: 1 }} />

                    {/* Nút hành động */}
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      spacing={2}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => setOpenOrderDetail(false)}
                      >
                        Đóng
                      </Button>

                      <Button
                        variant="contained"
                        color="error"
                        onClick={async () => {
                          try {
                            await updateOrderStatus.mutateAsync({
                              orderCode: selectedOrder.orderCode,
                              status: "reject",
                            });
                            toast.success("Đã từ chối đơn hàng!");
                            setOpenOrderDetail(false);
                          } catch (err) {
                            toast.error("Không thể từ chối đơn hàng!");
                            console.error("Lỗi từ chối:", err);
                          }
                        }}
                      >
                        Từ chối
                      </Button>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                          try {
                            await updateOrderStatus.mutateAsync({
                              orderCode: selectedOrder.orderCode,
                              status: "order_received",
                            });
                            toast.success("Đã nhận đơn hàng!");
                            setOpenOrderDetail(false);
                          } catch (err) {
                            toast.error("Không thể nhận đơn hàng!");
                            console.error("Lỗi nhận:", err);
                          }
                        }}
                      >
                        Nhận
                      </Button>
                    </Stack>
                  </Stack>
                )}
              </Paper>
            </Modal>

            {/* Wallet connect button */}
            <Button
              variant={isConnected ? "outlined" : "contained"}
              color={isConnected ? "inherit" : "primary"}
              size="small"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                px: 2,
                fontWeight: 600,
              }}
              onClick={() => setOpenWalletModal(true)}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : isConnected ? (
                `${address?.slice(0, 6)}...${address?.slice(-4)}`
              ) : (
                "Kết nối ví"
              )}
            </Button>

            {/* Account */}
            <Tooltip title="Tài khoản">
              <IconButton
                color="inherit"
                onClick={handleOpen(setAnchorAccount)}
              >
                <Avatar
                  src={avatarUrl}
                  alt="Avatar"
                  sx={{ width: 32, height: 32 }}
                />
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorAccount}
              open={openAccount}
              onClose={handleClose(setAnchorAccount)}
              PaperProps={{
                sx: { mt: 1.5, width: 220, borderRadius: 1, boxShadow: 5 },
              }}
            >
              <MenuItem
                onClick={() => {
                  router.push("/distributor/account");
                  handleClose(setAnchorAccount)();
                }}
              >
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>{" "}
                Hồ sơ cá nhân
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>{" "}
                Cài đặt
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>{" "}
                Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Wallet Modal */}
      <WalletModal
        open={openWalletModal}
        onClose={() => setOpenWalletModal(false)}
        // connectors={connectors}
        // connect={connect}
        // disconnect={disconnect}
      />
    </>
  );
}
