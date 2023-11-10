import { OpenAPIHono } from '@hono/zod-openapi';
import { DatabaseSingleton } from '../db/database';
import { users } from '../db/schemas/users';
import { getAllUsersRoute, getUserRoute } from '../openapi/routes/user';
import { eq } from 'drizzle-orm';

const db = DatabaseSingleton.getInstance().db;
const userApp = new OpenAPIHono();

userApp.openapi(getAllUsersRoute, async (c) => {
    const result = await db
        .select({
            securityNumber: users.securityNumber,
            firstName: users.firstName,
            lastName: users.lastName,
        })
        .from(users);

    return c.json({ users: result }, 200);
});

userApp.openapi(getUserRoute, async (c) => {
    const { securityNumber } = c.req.valid('param');
    const result = await db
        .select({
            securityNumber: users.securityNumber,
            firstName: users.firstName,
            lastName: users.lastName,
        })
        .from(users)
        .where(eq(users.securityNumber, securityNumber));

    const user = result.shift();
    if (!user) {
        return c.text('User not found', 404);
    }

    return c.json({ user: user }, 200);
});

export default userApp;
