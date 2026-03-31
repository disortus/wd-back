import { AppError } from "../utils/app-errors.js";
import { asyncHandler } from "../utils/async-handler.js";
import { getHomeData } from "../services/public.service.js";

export const getHome = asyncHandler(async (req, res) => {
    const data = await getHomeData();

    if (!data) {
        throw new AppError(404, "hero home page data not found");
    }

    res.json({
        ok: true,
        data
    });
});