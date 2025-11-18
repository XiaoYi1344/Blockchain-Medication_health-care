const db = require("../models");
const createError = require("http-errors");
const { default: mongoose } = require("mongoose");
const { tokenHandle, cloudinary, auditLogHandle, bcyptHandle, handleSuccess } = require("../utils/index");

const getOneUserById = async (id, select = null, populate = null) => {
   if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError.BadRequest('B6');
   }

   let query = db.User.findById(id);

   if (select) query = query.select(select);
   if (populate) query = query.populate(populate);

   const user = await query;
   return user;
};

const getOneUserByEmail = async (email, select = null) => {
   try {
      let query = db.User.findOne({ email });
      if (select) query = query.select(select);
      const user = await query;

      if (!user) {
         throw createError.NotFound("F2");
      }
      return user;
   } catch (error) {
      throw error;
   }
}

const getUsersWithRoles = async ({ userFilter = {}, roleFilter = {} }) => {
   return db.User.aggregate([
      { $match: userFilter },
      {
         $lookup: {
            from: "roleusers",
            localField: "_id",
            foreignField: "userId",
            as: "roleUsers"
         }
      },
      { $unwind: { path: "$roleUsers", preserveNullAndEmptyArrays: true } },
      {
         $lookup: {
            from: "roles",
            localField: "roleUsers.roleId",
            foreignField: "_id",
            as: "roleInfo"
         }
      },
      { $unwind: { path: "$roleInfo", preserveNullAndEmptyArrays: true } },
      { $match: roleFilter },
      {
         $project: {
            userId: "$_id",
            userName: "$userName",
            email: "$email",
            phone: "$phone",
            avatar: "$avatar",
            companyId: "$companyId",
            isActive: "$isActive",
            roleId: "$roleInfo._id",
            roleName: "$roleInfo.displayName",
            createdAt: 1,
            updatedAt: 1
         }
      }
   ]);
};

const getUserByCompanyAndRole = async (company) => {
  const roleId =
    company.type === 'manufacturer'
      ? process.env.ID_ROLE_MANUFACTURER
      : company.type === 'hospital'
        ? process.env.ID_ROLE_HOSPITAL
        : null;

  if (!roleId) return null;

  const results = await db.User.aggregate([
    { $match: { companyId: new mongoose.Types.ObjectId(company._id) } },
    {
      $lookup: {
        from: 'roleusers',
        localField: '_id',
        foreignField: 'userId',
        as: 'roles'
      }
    },
    { $unwind: '$roles' },
    {
      $match: {
        'roles.roleId': new mongoose.Types.ObjectId(roleId)
      }
    },
    { $limit: 1 }
  ]);

  return results[0] || null;
};

const handleGetAllUsers = async (type) => {
   try {
      let userFilter = {};
      let roleFilter = {}

      if (type === "guest") {
         roleFilter = { "roleInfo.name": 'guest' };
      } else if (type === "staff") {
         roleFilter = { "roleInfo.name": { $ne: "guest" } }
      }

      const result = await getUsersWithRoles({ userFilter, roleFilter });
      return handleSuccess("All users retrieved successfully", result);
   } catch (error) {
      throw error;
   }
};

const handleGetAllAdmin = async () => {
   try {
      const userFilter = {};

      const ROLE_ADMIN = process.env.ROLE_ADMIN.split(",");
      const roleFilter = { "roleInfo.name": { $in: ROLE_ADMIN } }
      const result = await getUsersWithRoles({ userFilter, roleFilter });

      return handleSuccess("All admins retrieved successfully", result);
   } catch (error) {
      throw error;
   }
};

const handleGetAllStaffs = async (companyId) => {
   try {
      const result = await getUsersWithRoles({
         userFilter: { companyId: new mongoose.Types.ObjectId(companyId) }
      });

      return handleSuccess("All staffs retrieved successfully", result);
   } catch (error) {
      throw error;
   }
};

const handleGetOneUser = async (id, select = null) => {
   try {
      const user = await getOneUserById(id, select, 'companyId')
      if (!user) {
         throw createError.NotFound("F2")
      }
      const transformedUser = {
         ...user.toObject ? user.toObject() : user,
         company: user.companyId ? user.companyId.name : null
      };
      delete transformedUser.companyId;

      return handleSuccess("User retrieved successfully", transformedUser);
   } catch (error) {
      throw error
   }
}

const handleCreateUser = async (userId, context, email, password, phone, userName, dob, companyId, roleIds = [], permissionIds = [], isEmailVerify = false) => {
   try {
      const { authorizationService } = require('./index');

      // Điều kiện tìm
      if (!email && !phone && !userName) {
         throw createError.NotFound("B2 B4 B5");
      }

      const isExistingUser = await findExistingUser(email, userName);
      if (isExistingUser) {
         throw createError.Conflict('F5');
      }
      const passwordStr = String(password).trim();
      const hashPassword = await bcyptHandle.hashPassword(passwordStr);

      let newData = { email, phone, userName, dob, password: hashPassword, isEmailVerify };
      if (companyId) newData.companyId = companyId;
      // Tạo mới
      const newUser = await db.User.create(newData);
      const { ipAddress, userAgent } = context

      // gán quyền cho user
      await Promise.all([
         authorizationService.handleAssignUserPermission(newUser._id, context, permissionIds),
         authorizationService.handleAssignUserRole(newUser._id, context, roleIds),
         auditLogHandle.createLog(userId, 'create', 'role', newUser._id, null, null, ipAddress, userAgent)
      ])

      return handleSuccess('User created successfully', newUser);
   } catch (error) {
      throw error;
   }
};

const findExistingUser = async (email, userName) => {
   try {
      const conditions = [];
      if (email) conditions.push({ email });
      if (userName) conditions.push({ userName });

      const user = await db.User.findOne({ $or: conditions });

      if (user) {
         return user;
      } else {
         return false;
      }
   } catch (error) {
      throw error;
   }
}

const handleUpdateUser = async (id, email = null, data = {}) => {
   try {
      if (!mongoose.Types.ObjectId.isValid(id) || !id) {
         if (data.avatar) await cloudinary.handleDeleteOneImg(data.avatar);
         throw createError.BadRequest('B6 B7');
      }

      const isUserExists = await getOneUserById(id, '+isEmailVerify');
      if (!isUserExists) {
         if (data.avatar) await cloudinary.handleDeleteOneImg(data.avatar);
         throw createError.NotFound('F2');
      }

      if (data.avatar && isUserExists.avatar) {
         await cloudinary.handleDeleteOneImg(isUserExists.avatar);
      }
      if (data.email || data.userName) {
         const duplicate = await db.User.findOne({
            $or: [{ email }, { userName: data.userName }],
            _id: { $ne: id }
         });

         if (duplicate) {
            if (duplicate.email === email) {
               if (data.avatar) await cloudinary.handleDeleteOneImg(data.avatar);
               throw createError.Conflict('F6');
            }
            if (duplicate.userName === data.userName) {
               if (data.avatar) await cloudinary.handleDeleteOneImg(data.avatar);
               throw createError.Conflict('F5');
            }
         }
      }

      let type = 'verify-email-again', sendOtp = false

      let updateData = { ...data };
      if (email && email !== isUserExists.email) {
         const findOtp = await tokenHandle.findOtp(id, type);

         if (!findOtp) {
            const authenticationService = require('../services/authentication.service');

            // Gửi OTP cho email hoặc phone mới
            await authenticationService.handleSendOtpToEmail(email, id, 'Verify your account.', type);
            sendOtp = true
         } else {
            // Đã verify OTP, có thể cập nhật email/phone
            await tokenHandle.deleteOtp(type, id);
            updateData.email = email;
         }
      }
      await db.User.findByIdAndUpdate(id, updateData);

      if (sendOtp) {
         return handleSuccess("User updated successfully. OTP sent for email/phone verification", { type });
      } else {
         return handleSuccess("User updated successfully", null);
      }
   } catch (error) {
      if (data.avatar) await cloudinary.handleDeleteOneImg(data.avatar);
      throw error;
   }
};

const handleUpdateIsActive = async (id, isActive = true) => {
   try {
      if (!mongoose.Types.ObjectId.isValid(id) || !id) {
         throw createError.BadRequest('B6 B7');
      }
      await handleGetOneUser(id);
      await db.User.findByIdAndUpdate(id, { isActive });
      if (!isActive) {
         const { tokenHandle } = require('../utils/index')
         await tokenHandle.deleteTokenById(id);
      }

      return handleSuccess("User updated isActive successfully");
   } catch (error) {
      throw error;
   }
};

const handleDeleteUser = async (_id) => {
   try {
      const { authorizationService, notificationService } = require('./index');
      const user = await getOneUserById(_id);
      if (!user) {
         throw createError.NotFound("F2")
      }
      if (user.avatar) {
         await cloudinary.handleDeleteOneImg(user.avatar);
      }
      await Promise.all([
         tokenHandle.deleteTokenById(_id),
         authorizationService.handleAssignUserRole(_id, []),
         authorizationService.handleAssignUserPermission(_id, []),
         notificationService.handleDeleteRecipient(_id)
      ])
      await db.User.findByIdAndDelete(_id)

      return handleSuccess("User deleted successfully");
   } catch (error) {
      throw error;
   }
};

const handleForgotPassword = async (email) => {
   try {
      const authenticationService = require('../services/authentication.service')
      if (!email) {
         throw createError.BadRequest("B4")
      }
      const user = await getOneUserByEmail(email, '+password +isEmailVerify');
      if (!user.isEmailVerify) {
         throw createError.BadRequest("D1");
      }
      const otp = await tokenHandle.findOtp(user.id, 'forgot-password')
      if (otp) await tokenHandle.deleteOtp('forgot-password', user.id)

      await authenticationService.handleSendOtpToEmail(email, user.id, 'Verify your account.', 'forgot-password')

      return handleSuccess("Send otp successfully", { type: 'forgot-password' });
   } catch (error) {
      throw error
   }
}

const handleNewPassword = async (email, newPassword) => {
   try {
      const user = await getOneUserByEmail(email, '+password +isEmailVerify');
      const findOtp = await tokenHandle.findOtp(user.id, 'forgot-password')
      if (!findOtp.isUsed || !findOtp) {
         throw createError.Unauthorized("D1 D3");
      }
      await Promise.all([
         handleUpdatePassword(user.id, newPassword),
         tokenHandle.deleteOtp(findOtp.type, user.id)
      ])

      return handleSuccess("Update password successfully")
   } catch (error) {
      throw error
   }
}

const handleChangePassword = async (userId, newPassword, oldPassword) => {
   try {
      if (!userId) {
         throw createError.BadRequest("B7");
      }
      const user = await getOneUserById(userId, '+password')
      const isMatch = await bcyptHandle.comparePassword(oldPassword, user.password)
      if (!isMatch) {
         throw createError.Unauthorized("D2");
      }
      await handleUpdatePassword(user.id, newPassword)
      return handleSuccess("Update password successfully")
   } catch (error) {
      throw error
   }
}

const handleUpdatePassword = async (userId, newPassword) => {
   try {
      const password = await bcyptHandle.hashPassword(newPassword)
      await db.User.findByIdAndUpdate(userId, { password });
      return handleSuccess("Update password successfully")
   } catch (error) {
      throw error
   }
}

module.exports = {
   handleGetAllUsers,
   handleGetAllAdmin,
   handleGetAllStaffs,
   handleGetOneUser,
   handleCreateUser,
   handleDeleteUser,
   handleUpdateUser,
   handleForgotPassword,
   handleNewPassword,
   findExistingUser,
   handleChangePassword,
   getOneUserByEmail,
   getOneUserById,
   handleUpdateIsActive,
   getUserByCompanyAndRole
}