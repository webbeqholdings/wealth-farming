import { Access } from "payload";

import { User } from "../payload-types";

export const isAdmin: Access< User> = ({ req: { user } }) => {
    return Boolean(user?.role?.includes('admin'));
}