import * as fns from "@/lib/admin.functions";

export async function checkAdminAccess() {
  try {
    return await fns.adminCheckAccess();
  } catch {
    return { isAdmin: false };
  }
}

export const listSpine = () => fns.adminListSpine();
export const getHqSummary = () => fns.adminGetHqSummary();
export const listUsers = () => fns.adminListUsers();
export const setUserRole = (userId: string, role: "admin" | "moderator" | "user", grant: boolean) =>
  fns.adminSetUserRole({ data: { userId, role, grant } });
