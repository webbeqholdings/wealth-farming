import { Access } from "payload";

import { User } from "../payload-types";

export const isIndividual: Access< User> = ({ req: { user } }) => {
    return Boolean(user?.role?.includes('individual'));
}