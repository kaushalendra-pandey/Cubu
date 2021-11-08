import { ValidationError } from "yup";

export const formatYupError = (err: ValidationError) => {
    const errors: Array<{ path: string; message: string }> = [];
    err.inner.forEach(e => {
        if (e.path != undefined) {
            errors.push({
                path: e.path,
                message: e.message
            });
        }
    });

    return errors;
};