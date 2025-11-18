// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CompanyRegistry {
    enum Status { Pending, Approved, Rejected }

    struct Company {
        uint256 id;
        string name;
        string newName;
        string companyCode;
        string ctype;
        string location;
        string phone;
        string nationality;
        bool isActive;
        Status status;
        address owner;
    }

    uint256 private companyCount;
    mapping(uint256 => Company) private companies;
    mapping(address => uint256) private ownerToCompany;

    event CompanyCreated(uint256 indexed id, string name, address indexed owner);
    event CompanyStatusChanged(uint256 indexed id, bool isActive);
    event CompanyNameApproval(uint256 indexed id, Status status);

    modifier onlyOwner(uint256 companyId) {
        require(companies[companyId].owner == msg.sender, "Not company owner");
        _;
    }

    // ✅ Tạo công ty mới
    function createCompany(
        string memory name,
        string memory ctype,
        string memory location,
        string memory phone,
        string memory nationality
    ) external {
        require(ownerToCompany[msg.sender] == 0, "Already owns a company");
        companyCount++;

        companies[companyCount] = Company({
            id: companyCount,
            name: name,
            newName: "",
            companyCode: _generateCode(companyCount),
            ctype: ctype,
            location: location,
            phone: phone,
            nationality: nationality,
            isActive: true,
            status: Status.Approved,
            owner: msg.sender
        });

        ownerToCompany[msg.sender] = companyCount;
        emit CompanyCreated(companyCount, name, msg.sender);
    }

    // ✅ Ngừng hoạt động / kích hoạt lại công ty
    function setCompanyActive(uint256 companyId, bool active)
        external
        onlyOwner(companyId)
    {
        companies[companyId].isActive = active;
        emit CompanyStatusChanged(companyId, active);
    }

    // ✅ Đổi tên công ty → chờ duyệt
    function requestNameChange(uint256 companyId, string memory newName)
        external
        onlyOwner(companyId)
    {
        Company storage c = companies[companyId];
        c.newName = newName;
        c.status = Status.Pending;
    }

    // ✅ Duyệt hoặc từ chối tên mới
    function approveCompanyName(uint256 companyId, bool approve) external {
        Company storage c = companies[companyId];
        require(c.status == Status.Pending, "Not pending");
        if (approve) {
            c.name = c.newName;
            c.newName = "";
            c.status = Status.Approved;
        } else {
            c.status = Status.Rejected;
        }
        emit CompanyNameApproval(companyId, c.status);
    }

    // ✅ Lấy thông tin 1 công ty
    function getCompany(uint256 companyId)
        external
        view
        returns (Company memory)
    {
        return companies[companyId];
    }

    // ✅ Lấy tất cả công ty
    function getAllCompanies() external view returns (Company[] memory) {
        Company[] memory list = new Company[](companyCount);
        for (uint256 i = 1; i <= companyCount; i++) {
            list[i - 1] = companies[i];
        }
        return list;
    }

    // ✅ Hàm phụ: sinh mã công ty
    function _generateCode(uint256 id) private pure returns (string memory) {
        return string(abi.encodePacked("COMP-", _uintToString(id)));
    }

    function _uintToString(uint256 v) private pure returns (string memory) {
        if (v == 0) return "0";
        uint256 j = v;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        while (v != 0) {
            k--;
            bstr[k] = bytes1(uint8(48 + v % 10));
            v /= 10;
        }
        return string(bstr);
    }
}
