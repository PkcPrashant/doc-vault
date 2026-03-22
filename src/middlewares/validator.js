import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const validatorMiddleware = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync({
                body: req.body,
                // query: req.query,
                // params: req.params
            });

            req.body = parsed.body ?? req.body;
            // req.query = parsed.query ?? req.query;
            // req.params = parsed.params ?? req.params;
            next();
        } catch (errors) {
            if (errors instanceof ZodError) {
                throw new ApiError(400, "validation failed", {
                    errors: errors?.issues.map((error) => ({
                        message: error.message,
                        path: error.path.join(".")
                    }))
                })
            }
            next(errors);
        }
    }
}