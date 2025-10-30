// import Cookies from "js-cookie";
// import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
// import { ProductResponse } from "@/types/drug";

// const COOKIE_KEY = "draftProducts";

// // 🧩 Đọc dữ liệu từ cookie
// export const getLocalDraftProducts = (): ProductResponse[] => {
//   try {
//     const raw = Cookies.get(COOKIE_KEY);
//     if (!raw) return [];
//     const json = decompressFromEncodedURIComponent(raw);
//     if (!json) return [];
//     return JSON.parse(json);
//   } catch (err) {
//     console.error("❌ Lỗi khi đọc cookie draftProducts:", err);
//     return [];
//   }
// };

// // 💾 Lưu danh sách thuốc nháp (đã nén)
// export const saveLocalDraftProducts = (list: ProductResponse[]) => {
//   try {
//     const compressed = compressToEncodedURIComponent(JSON.stringify(list));
//     Cookies.set(COOKIE_KEY, compressed, { expires: 1 }); // 1 ngày
//   } catch (err) {
//     console.error("❌ Lỗi khi lưu cookie draftProducts:", err);
//   }
// };

// // ➕ Thêm thuốc nháp
// export const addLocalDraftProduct = (item: ProductResponse) => {
//   const drafts = getLocalDraftProducts();
//   drafts.push(item);
//   saveLocalDraftProducts(drafts);
// };

// // 🔁 Cập nhật thuốc nháp
// export const updateLocalDraftProduct = (item: ProductResponse) => {
//   const drafts = getLocalDraftProducts().map((p) =>
//     p._id === item._id ? item : p
//   );
//   saveLocalDraftProducts(drafts);
// };

// // ❌ Xóa thuốc nháp
// export const deleteLocalDraftProduct = (id: string) => {
//   const drafts = getLocalDraftProducts().filter((p) => p._id !== id);
//   saveLocalDraftProducts(drafts);
// };
