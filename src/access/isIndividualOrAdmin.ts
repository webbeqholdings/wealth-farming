import { Access } from "payload";
import { User } from "../payload-types";

export const isIndividualOrAdmin: Access<User> = ({ req: { user } }) => {
    return Boolean(user?.role?.includes('individual') || user?.role?.includes('admin'));
};
