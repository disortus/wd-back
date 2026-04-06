export const parseJsonField = (value, fallback = undefined) => {
    if (value === undefined) {
        return fallback;
    }

    if (typeof value !== "string") {
        return value;
    }

    const trimmed = value.trim();

    if (!trimmed) {
        return fallback ?? value;
    }

    try {
        return JSON.parse(trimmed);
    } catch {
        return value;
    }
};

export const parseArrayField = (value) => {
    const parsed = parseJsonField(value, []);

    if (Array.isArray(parsed)) {
        return parsed.filter((item) => item !== undefined && item !== null && item !== "");
    }

    if (parsed === undefined || parsed === null || parsed === "") {
        return [];
    }

    return [parsed];
};

export const parseObjectField = (value, fallback = {}) => {
    const parsed = parseJsonField(value, fallback);

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed;
    }

    return fallback;
};

export const parseNumberField = (value, fallback = undefined) => {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : fallback;
};

export const parseBooleanField = (value, fallback = undefined) => {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }

    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();

        if (["true", "1", "yes", "on"].includes(normalized)) {
            return true;
        }

        if (["false", "0", "no", "off"].includes(normalized)) {
            return false;
        }
    }

    return fallback;
};