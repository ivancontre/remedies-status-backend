import { UserModel } from "../models";

export const notExistsStatus = async (status: string) => {

    if (status !== 'CLOSED' && status !== 'OPEN') {
        throw new Error(`El status "${ status }" no existe`);
    }

    return true;
};

export const notExistsField = async (field: string) => {

    if (field !== 'morning' && field !== 'afternoon') {
        throw new Error(`El field "${ field }" no existe`);
    }

    return true;
};

export const existsEmail = async (email: string) => {

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
        throw new Error(`El email "${ email }" ya se encuentra registrado en la BD`);
    }

    return true;
};