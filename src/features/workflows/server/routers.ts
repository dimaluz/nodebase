import { PAGINATION } from "@/config/constants";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";

export const workflowsRouter = createTRPCRouter({
    create: premiumProcedure.mutation(({ ctx }) => {
        return (
            // TODO Create procedure of workflow
            // data: {
            // name: "Workflow name"
            // userId: ctx.auth.user.id
            //}
        );
    }),
    remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
        // TODO Delete the workflow
            // where: {
            // id: input.id
            // userId: ctx.auth.user.id
            // 
            //}
    }),
    updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ ctx }) => {
        return (
            // TODO Update the workflow
            // where: {
            // id: input.id
            // userId: ctx.auth.user.id
            //}
            //data: {
            //  name: input.name
            //}
        )
    }),
    getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
        return (
            //TODO Extract the data of workflow
            // where: {
            // id: input.id
            // userId: ctx.auth.user.id
            //}
        )
    }),
    getMany: protectedProcedure
    .input(
        z.object({
            page: z.number().default(PAGINATION.DEFAULT_PAGE),
            pageSize: z
            .number()
            .min(PAGINATION.MIN_PAGE_SIZE)
            .max(PAGINATION.MAX_PAGE_SIZE)
            .default(PAGINATION.DEFAULT_PAGE_SIZE),
            search: z.string().default(""),
        })
    )
    .query(async ({ ctx, input }) => {
        const { page, pageSize, search } = input;
        const [ items, totalCount ] = await Promise.all([
            //TODO Extract the data of many workflows
            // where: {
            // userId: ctx.auth.user.id
            //}
        ])
        return (
            //TODO Extract the data of many workflows
            // skip: (page - 1) * pageSize,
            // take: pageSize,
            // where: {
            // userId: ctx.auth.user.id,
            // name: {
            //  contains: search,
            //  mode: "insensitive",
            // }
            //},
            // orderBy: {
            //  updatedAt: desc
            //}
            //TODO Extract the count of workflows
            // where: {
            // userId: ctx.auth.user.id
            //}

            // const totalPages = Math.ceil(totalCount / pageSize)
            // const hasNextPage = page < totalPages
            // const hasPrevPage = page > 1
            /**
             * return {
             *  items,
             *  page,
             *  pageSize,
             *  totalCount,
             *  totalPages,
             *  hasNextPage,
             *  hasPrevPage,
             * }
             */
        )
    })
})