// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract LicenseRegistry is AccessControl {
    bytes32 public constant MANAGEMENT_LICENSE_ROLE = keccak256("MANAGEMENT_LICENSE_ROLE");

    enum Status { Unknown, Active, Expired, Revoked } 

    struct License {
        string id;          // uuid/string id (off-chain id)
        string name;
        string companyId;   // company identifier (string)
        string licenseId;   // official license number
        string docHash;     // IPFS CID / doc hash
        string[] images;    // array of IPFS CIDs
        uint256 expiryDate; // unix timestamp
        string licenseType; // loại giấy phép
        Status status;      // enum
        uint256 createdAt;
        uint256 updatedAt;
    }

    // store by on-chain index
    mapping(string => License) private licenses; // license.id => License
    mapping(string => string[]) private companyToLicenseIds; // companyId => list of license ids

    event LicenseCreated(string indexed id, string companyId, address indexed creator, uint256 timestamp);
    event LicenseUpdated(string indexed id, Status status, address indexed updater, uint256 timestamp);
    event LicenseMetadataUpdated(string indexed id, address indexed updater, uint256 timestamp);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MANAGEMENT_LICENSE_ROLE, admin);
    }

    modifier licenseExists(string memory id) {
        require(licenses[id].createdAt != 0, "License: not exists");
        _;
    }

    function createLicense(
        string memory id,
        string memory name,
        string memory companyId,
        string memory licenseId,
        string memory docHash,
        string[] memory images,
        uint256 expiryDate,
        string memory licenseType,
        uint8 status // 1 active, 2 expired, 3 revoked
    ) external  {
        require(licenses[id].createdAt == 0, "License: already exists");
        License storage l = licenses[id];
        l.id = id;
        l.name = name;
        l.companyId = companyId;
        l.licenseId = licenseId;
        l.docHash = docHash;
        l.images = images;
        l.expiryDate = expiryDate;
        l.licenseType = licenseType;
        if(status > 3) status = 0;
        l.status = Status(status);
        l.createdAt = block.timestamp;
        l.updatedAt = block.timestamp;

        companyToLicenseIds[companyId].push(id);
        emit LicenseCreated(id, companyId, msg.sender, block.timestamp);
    }

    function updateStatus(string memory id, uint8 status) external onlyRole(MANAGEMENT_LICENSE_ROLE) licenseExists(id) {
        require(status >= 1 && status <= 3, "Invalid status");
        licenses[id].status = Status(status);
        licenses[id].updatedAt = block.timestamp;
        emit LicenseUpdated(id, licenses[id].status, msg.sender, block.timestamp);
    }

    function updateMetadata(
        string memory id,
        string memory docHash,
        string[] memory images,
        uint256 expiryDate,
        string memory licenseType
    ) external onlyRole(MANAGEMENT_LICENSE_ROLE) licenseExists(id) {
        License storage l = licenses[id];
        l.docHash = docHash;
        l.images = images;
        l.expiryDate = expiryDate;
        l.licenseType = licenseType;
        l.updatedAt = block.timestamp;
        emit LicenseMetadataUpdated(id, msg.sender, block.timestamp);
    }

    // view helpers
    function getLicense(string memory id) external view licenseExists(id) returns (
        string memory, string memory, string memory, string memory, string[] memory, uint256, string memory, Status, uint256, uint256
    ) {
        License storage l = licenses[id];
        return (
            l.id, l.name, l.companyId, l.licenseId, l.images, l.expiryDate, l.licenseType, l.status, l.createdAt, l.updatedAt
        );
    }

    function getLicensesByCompany(string memory companyId) external view returns (string[] memory) {
        return companyToLicenseIds[companyId];
    }
}
