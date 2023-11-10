import { OpenAPIHono } from '@hono/zod-openapi';
import { DatabaseSingleton } from '../db/database';
import { users } from '../db/schemas/users';
import { getAllUsersRoute } from '../openapi/routes/user';

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

export default userApp;
