import { Access } from "payload";
import { User } from "../payload-types";

export const isAdminViewOnlyOrAdmin: Access<User> = ({ req: { user } }) => {
    return Boolean(user?.role?.includes('ad-viewonly') || user?.role?.includes('admin'));
};