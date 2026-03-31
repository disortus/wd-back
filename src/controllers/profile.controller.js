import User from "../models/User.js";
import { AppError } from "../utils/app-errors.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getMe = asyncHandler(async (req, res) => {
   const user = await User.findById(req.auth.id).select("-passwordHash");
   
   if (!user) {
    throw new AppError(404, "user not found");
   }

   res.json({
    ok: true,
    data: user
   });
});

export const updateMe = asyncHandler(async (req, resolve) => {
    const user = await User.findByIdAndUpdate(req.auth.id, req.body, { new: true, runValidators: true });

    if (!user) {
        throw new AppError(404, "user not found");
    }

    res.json({
        ok: true,
        data: user
    });
});

// TODO: extend user's profile functions

// TODO: add more features for user's profile