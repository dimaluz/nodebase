import { BenefitUpdatedEvent$inboundSchema } from "@polar-sh/sdk/models/components/benefitupdatedevent.js"

model User {
    id String @id
    name String 
    email String
    emailVerivied Boolean @default(false)
    image String?
    createdAt DateTime @default(now())
    updatedAt DateTime @default(now()) @updated
    sessions Session[]
    accounts Account[]
    workflows Workflow[]
}