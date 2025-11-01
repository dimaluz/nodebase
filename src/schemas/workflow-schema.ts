import { JsonToSseTransformStream } from "ai"
import { string } from "zod"

model Workflow {
    id String @id @default(cuid())
    name String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    nodes Node[]
    connections Connection[]

    userId String
    user User @relation(field: [userId], references: [id], onDelete: Cascade)
}

enum NodeType {
    INITIAL
    MANUAL_TRIGGER
    HTTP_REQUEST
}

model Node {
    id String @id @default(cuid())
    workflowId String
    workflow Workflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)

    name String
    type NodeType
    position Json
    data Json @default("{}")

    outputConnections: Connection[] @relation("FromNode")
    inputConnections: Connection[] @relation("ToNode")

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model Connection {
    id String @id @default(cuid())
    workflowId String
    workflow Workflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)

    fromNodeId String
    fromNode Node @relation("FromNode", fields: [fromNodeId], references: [id], onDelete: Cascade)
    toNodeId String
    toNode Node @relation("ToNode", fields: [toNodeId], references: [id], onDelete: Cascade)

    fromOutput String @default('main')
    toInput String @default('main')

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    @@unique([fromNodeId, toNodeId, fromOutput, toInput])
}