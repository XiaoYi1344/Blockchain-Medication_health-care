// import { User } from '@/types/user';
// import { Complain, UpdateComplainRequest, GetComplainsRequest } from '../types/complain';

// const API_BASE = '/api/complain';

// export const updateComplain = async (data: UpdateComplainRequest, accessToken: string): Promise<Complain> => {
//   const res = await fetch(API_BASE, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       'accessToken': accessToken
//     },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error('Failed to update complain');
//   return res.json();
// };

// export const getComplains = async (
//   status: Complain['status'],
//   user: User,
//   accessToken: string
// ): Promise<Complain[]> => {
//   const res = await fetch('/api/complain', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       accessToken,
//     },
//     body: JSON.stringify({
//       status,
//       companyId: user.companyId,
//       role: user.role, // server sẽ lọc theo role
//     }),
//   });
//   if (!res.ok) throw new Error('Failed to fetch complains');
//   return res.json();
// };

