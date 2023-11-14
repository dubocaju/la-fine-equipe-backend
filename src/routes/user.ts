import { OpenAPIHono } from '@hono/zod-openapi';
import { DatabaseSingleton } from '../db/database';
import { users } from '../db/schemas/users';
import { getAllUsersRoute, getUserRoute } from '../openapi/routes/user';
import { eq, sql } from 'drizzle-orm';

const db = DatabaseSingleton.getInstance().db;
const userApp = new OpenAPIHono();

userApp.openapi(getAllUsersRoute, async (c) => {
    const { select, filter, sortBy, orderBy } = c.req.valid('query');
    console.log(
        'select : ||',
        select,
        'filter : ',
        filter,
        'sortBy :',
        sortBy,
        ' orderBy :',
        orderBy
    );
    const result = db.get<{ text: string }>(
        sql`select ${sql.raw(select ?? '*')} from ${users}`
    );
    // TODO : create queriable shema/view, without ID & password

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
