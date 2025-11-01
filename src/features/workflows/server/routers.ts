import { PAGINATION } from "@/config/constants";
import type { Node, Edge } from "@xyflow/react";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";

export const workflowsRouter = createTRPCRouter({
    create: premiumProcedure.mutation(({ ctx }) => {
        return (
            /**
             * prisma.workflow.create({
             * data: {
             *  name: generateSlug(3),
             *  userId: ctx.auth.user.id.
             *  nodes: {
             *      createMany: {
             *          data:[{
             *              type: NodeType.INITIAL,  ---- import {NodeType} from "@/schemas/workflow-schema"
             *              position: {x:0, y:0},
             *              name: NodeType.INITIAL,
             *          }],
             *      }
             *  }
             * }
             * 
             * })
             */
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
    update: protectedProcedure
    .input(
        z.object({ 
            id: z.string(), 
            nodes: z.array(
                z.object({
                    id: z.string(),
                    type: z.string().nullish(),
                    position: z.object({ x: z.number(), y: z.number() }),
                    data: z.record(z.string(), z.any()).optional(),
                }),
            ),
            edges: z.array(
                z.object({
                    source: z.string(),
                    target: z.string(),
                    sourceHandler: z.string().nullish(),
                    targetHandler: z.string().nullish(),
                }),
            ),
        }),
    )
    .mutation(async ({ ctx, input }) => {
        const { id, nodes, edges } = input;

        /**
         * const workflow = await prisma.workflow.findUniqueOrThrow({
         *  where: {id, userId: ctx.auth.user.id},
         * }) 
         */ 

        // Transaction to ensure consistency
        /**
         * return await prisma.$transaction(async (tx) => {
         *  Delete existing nodes and connections (cascade deletes connections)
         *  await tx.node.deleteMany({
         *          where: { workflowId: id },
         *  })
         *  Create new nodes
         *  await tx.node.createMany({
         *      data: nodes.map((node) => ({
         *          id: node.id,
         *          workflowId: id,
         *          name: node.type || "unknown",
         *          type: node.type as NodeType,
         *          position: node.position,
         *          data: node.data || {}
         *      })),
         *  });
         *  Create connections
         *  await tx.connection.createMany({
         *      data: edges.map((edge) => ({
         *          workflowId: id,
         *          fromNodeId: edge.source,
         *          toNodeId: edge.target,
         *          fromOutput: edge.sourceHandle || "main",
         *          toInput: edge.targetHandle || "main",
         *      })),
         *  });
         *  Update workflow's updateAt timestamp
         *  await tx.workflow.update({
         *      where: {id},
         *      data: {updateAt: new Date()},
         *  });
         *  return workflow;
         * });
         */
    }),
    getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query( async ({ ctx, input }) => {
        /**
         * const workflow = await prisma.workflow.findUniqueOrThrow({
         *  where: {id: input.id, userId: ctx.auth.user.id}
         *  include: {nodes: true, connections: true}
         * });
         * }
         */
        /** Transform server nodes to react-flow compatible nodes
         * const nodes: Node[] = workflow.nodes.map((node) => ({
         *  id: node.id,
         *  type: node.type,
         *  position: node.position as {x: number, y: number},
         *  data: (node.data as Record<string, unknown>) || {},
         * }))
         */
        /** Transform server connections to react-flow compatible edges
         * const edges: Edge[] = workflow.connection.map((connection) => ({
         *  id: connection.id,
         *  source: connection.fromNode,
         *  target: connection.toNode,
         *  sourceHandle: connection.fromOutput,
         *  targetHandle: connection.toInput,
         * }))
         */
        return {
            id: workflow.id,
            name: workflow.name,
            nodes,
            edges,
        };
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