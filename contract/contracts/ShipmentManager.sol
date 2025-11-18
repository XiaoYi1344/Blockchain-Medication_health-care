// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title ShipmentManager
/// @notice Smart contract quản lý shipment (tạo, cập nhật, lấy danh sách)
contract ShipmentManager is AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant SHIPMENT_MANAGER_ROLE = keccak256("SHIPMENT_MANAGER_ROLE");
    Counters.Counter private _shipmentIds;

    struct Shipment {
        uint256 id;
        string shipCode;            // Mã vận đơn
        string batchCode;           // Mã lô hàng
        uint256 quantityBatch;      // Số lượng
        string fromCompanyId;       // Công ty gửi
        string toCompanyId;         // Công ty nhận
        string vehiclePlateNumber;  // Biển số xe
        string driverName;          // Tên tài xế
        string driverPhoneNumber;   // SĐT tài xế
        string note;                // Ghi chú bảo quản
        uint256 receivingTime;      // Thời gian nhận (timestamp)
        bool exists;                // Cờ kiểm tra shipment có tồn tại không
    }

    mapping(uint256 => Shipment) private shipments;
    uint256[] private shipmentList;

    event ShipmentCreated(uint256 indexed id, string shipCode);
    event ShipmentUpdated(uint256 indexed id);
    event ShipmentReceivingUpdated(uint256 indexed id, uint256 receivingTime);

    constructor(address admin) {
        address _admin = admin == address(0) ? msg.sender : admin;
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(SHIPMENT_MANAGER_ROLE, _admin);
    }

    modifier shipmentExists(uint256 shipmentId) {
        require(shipments[shipmentId].exists, "Shipment not found");
        _;
    }

    /// @notice Tạo shipment
    function createShipment(
        string calldata shipCode,
        string calldata batchCode,
        uint256 quantityBatch,
        string calldata fromCompanyId,
        string calldata toCompanyId
    ) external onlyRole(SHIPMENT_MANAGER_ROLE) returns (uint256) {
        _shipmentIds.increment();
        uint256 newId = _shipmentIds.current();

        shipments[newId] = Shipment({
            id: newId,
            shipCode: shipCode,
            batchCode: batchCode,
            quantityBatch: quantityBatch,
            fromCompanyId: fromCompanyId,
            toCompanyId: toCompanyId,
            vehiclePlateNumber: "",
            driverName: "",
            driverPhoneNumber: "",
            note: "",
            receivingTime: 0,
            exists: true
        });

        shipmentList.push(newId);

        emit ShipmentCreated(newId, shipCode);
        return newId;
    }

    /// @notice Tạo shipment
    function createShipmentFull(
        string calldata shipCode,
        string calldata batchCode,
        uint256 quantityBatch,
        string calldata fromCompanyId,
        string calldata toCompanyId,
        string calldata vehiclePlateNumber,
        string calldata driverName,
        string calldata driverPhoneNumber,
        string calldata note,
        uint256 receivingTime
    ) external onlyRole(SHIPMENT_MANAGER_ROLE) returns (uint256) {
        _shipmentIds.increment();
        uint256 newId = _shipmentIds.current();

        shipments[newId] = Shipment({
            id: newId,
            shipCode: shipCode,
            batchCode: batchCode,
            quantityBatch: quantityBatch,
            fromCompanyId: fromCompanyId,
            toCompanyId: toCompanyId,
            vehiclePlateNumber: vehiclePlateNumber,
            driverName: driverName,
            driverPhoneNumber: driverPhoneNumber,
            note: note,
            receivingTime: receivingTime,
            exists: true
        });

        shipmentList.push(newId);

        emit ShipmentCreated(newId, shipCode);
        return newId;
    }

    /// @notice Cập nhật thông tin vận chuyển
    function updateShipmentInfo(
        uint256 shipmentId,
        string calldata vehiclePlateNumber,
        string calldata driverName,
        string calldata driverPhoneNumber,
        string calldata note
    ) external onlyRole(SHIPMENT_MANAGER_ROLE) shipmentExists(shipmentId) {
        Shipment storage s = shipments[shipmentId];
        s.vehiclePlateNumber = vehiclePlateNumber;
        s.driverName = driverName;
        s.driverPhoneNumber = driverPhoneNumber;
        s.note = note;

        emit ShipmentUpdated(shipmentId);
    }

    /// @notice Cập nhật thời gian nhận hàng
    function updateReceivingTime(uint256 shipmentId, uint256 receivingTime)
        external
        onlyRole(SHIPMENT_MANAGER_ROLE)
        shipmentExists(shipmentId)
    {
        shipments[shipmentId].receivingTime = receivingTime;
        emit ShipmentReceivingUpdated(shipmentId, receivingTime);
    }

    /// @notice Lấy chi tiết 1 shipment
    function getShipment(uint256 shipmentId)
        external
        view
        shipmentExists(shipmentId)
        returns (Shipment memory)
    {
        return shipments[shipmentId];
    }

    /// @notice Lấy toàn bộ shipment
    function getAllShipments() external view returns (Shipment[] memory) {
        Shipment[] memory result = new Shipment[](shipmentList.length);
        for (uint256 i = 0; i < shipmentList.length; i++) {
            result[i] = shipments[shipmentList[i]];
        }
        return result;
    }

    /// @notice Lấy shipment theo shipCode
    function getShipmentsByCode(string calldata shipCode) external view returns (Shipment[] memory) {
        uint256 count;
        for (uint256 i = 0; i < shipmentList.length; i++) {
            if (keccak256(bytes(shipments[shipmentList[i]].shipCode)) == keccak256(bytes(shipCode))) {
                count++;
            }
        }

        Shipment[] memory result = new Shipment[](count);
        uint256 j;
        for (uint256 i = 0; i < shipmentList.length; i++) {
            if (keccak256(bytes(shipments[shipmentList[i]].shipCode)) == keccak256(bytes(shipCode))) {
                result[j] = shipments[shipmentList[i]];
                j++;
            }
        }
        return result;
    }

    // ADMIN helpers
    function grantShipmentManager(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(SHIPMENT_MANAGER_ROLE, account);
    }

    function revokeShipmentManager(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(SHIPMENT_MANAGER_ROLE, account);
    }
}
