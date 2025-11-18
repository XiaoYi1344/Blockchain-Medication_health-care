// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Product Registry - Quản lý thông tin sản phẩm nông sản
/// @notice Cho phép tạo, xem, sửa và xóa sản phẩm. Ai cũng có thể gọi các hàm này.
contract ProductRegistry {
    struct Product {
        uint256 id;
        string name;           // Tên sản phẩm
        string uom;            // Đơn vị đo (kg, hộp, chai,...)
        uint256 uomQuantity;   // Số lượng theo đơn vị
        string companyCode;    // Mã công ty
        string productType;    // domestic / abroad
        string gtin;           // Mã định danh toàn cầu
        string origin;         // Nơi sản xuất
        string description;    // Mô tả
        uint256 createdAt;     // Thời gian tạo
        uint256 updatedAt;     // Thời gian cập nhật gần nhất
        address createdBy;     // Người tạo
        bool isDeleted;        // Đánh dấu đã xóa
    }

    uint256 private _nextId = 1;
    mapping(uint256 => Product) private _products;

    /// --- Sự kiện ---
    event ProductCreated(
        uint256 indexed id,
        string name,
        string uom,
        uint256 uomQuantity,
        string companyCode,
        string productType,
        string gtin,
        string origin,
        string description,
        address createdBy
    );

    event ProductUpdated(
        uint256 indexed id,
        string name,
        string uom,
        uint256 uomQuantity,
        string companyCode,
        string productType,
        string gtin,
        string origin,
        string description,
        address updatedBy
    );

    event ProductDeleted(uint256 indexed id, address deletedBy);

    /// --- Tạo sản phẩm ---
    function createProduct(
        string memory name,
        string memory uom,
        uint256 uomQuantity,
        string memory companyCode,
        string memory productType,
        string memory gtin,
        string memory origin,
        string memory description
    ) external {
        uint256 productId = _nextId++;
        Product storage p = _products[productId];

        p.id = productId;
        p.name = name;
        p.uom = uom;
        p.uomQuantity = uomQuantity;
        p.companyCode = companyCode;
        p.productType = productType;
        p.gtin = gtin;
        p.origin = origin;
        p.description = description;
        p.createdAt = block.timestamp;
        p.updatedAt = block.timestamp;
        p.createdBy = msg.sender;
        p.isDeleted = false;

        emit ProductCreated(
            productId,
            name,
            uom,
            uomQuantity,
            companyCode,
            productType,
            gtin,
            origin,
            description,
            msg.sender
        );
    }

    /// --- Cập nhật sản phẩm ---
    function updateProduct(
        uint256 productId,
        string memory name,
        string memory uom,
        uint256 uomQuantity,
        string memory companyCode,
        string memory productType,
        string memory gtin,
        string memory origin,
        string memory description
    ) external {
        Product storage p = _products[productId];
        require(p.id > 0 && !p.isDeleted, "Product not found");

        p.name = bytes(name).length > 0 ? name : p.name;
        p.uom = bytes(uom).length > 0 ? uom : p.uom;
        if (uomQuantity > 0) p.uomQuantity = uomQuantity;
        p.companyCode = bytes(companyCode).length > 0 ? companyCode : p.companyCode;
        p.productType = bytes(productType).length > 0 ? productType : p.productType;
        p.gtin = bytes(gtin).length > 0 ? gtin : p.gtin;
        p.origin = bytes(origin).length > 0 ? origin : p.origin;
        p.description = bytes(description).length > 0 ? description : p.description;
        p.updatedAt = block.timestamp;

        emit ProductUpdated(
            productId,
            p.name,
            p.uom,
            p.uomQuantity,
            p.companyCode,
            p.productType,
            p.gtin,
            p.origin,
            p.description,
            msg.sender
        );
    }

    /// --- Xóa sản phẩm (đánh dấu là đã xóa) ---
    function deleteProduct(uint256 productId) external {
        Product storage p = _products[productId];
        require(p.id > 0 && !p.isDeleted, "Product not found");
        p.isDeleted = true;
        emit ProductDeleted(productId, msg.sender);
    }

    /// --- Xem sản phẩm ---
    function getProduct(uint256 productId) external view returns (Product memory) {
        Product memory p = _products[productId];
        require(p.id > 0 && !p.isDeleted, "Product not found");
        return p;
    }

    /// --- Tổng số sản phẩm đã tạo ---
    function getTotalProducts() external view returns (uint256) {
        return _nextId - 1;
    }

    /// --- Lấy tất cả sản phẩm chưa bị xóa ---
    function getAllProducts() external view returns (Product[] memory) {
        uint256 total = _nextId - 1;
        uint256 count = 0;

        // Đếm số sản phẩm còn hoạt động
        for (uint256 i = 1; i <= total; i++) {
            if (!_products[i].isDeleted) count++;
        }

        Product[] memory active = new Product[](count);
        uint256 index = 0;

        // Ghi vào mảng kết quả
        for (uint256 i = 1; i <= total; i++) {
            if (!_products[i].isDeleted) {
                active[index] = _products[i];
                index++;
            }
        }
        return active;
    }
}
