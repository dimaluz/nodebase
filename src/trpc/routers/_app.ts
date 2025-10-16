import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
export const appRouter = createTRPCRouter({
  getUsers: baseProcedure.query(() => {
      return {
        // TODO получить всех пользователей из БД,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;