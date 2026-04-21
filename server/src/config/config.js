
const cookieSecure =
    process.env.COOKIE_SECURE === "true"
        ? true
        : process.env.COOKIE_SECURE === "false"
            ? false
            : process.env.NODE_ENV === "production";

export const cookieOptions = {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: "Lax",
    maxAge: 1000 * 60 * 60, // 5 minutes
}