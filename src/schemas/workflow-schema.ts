model Workflow {
    id String @id @default(cuid())
    name String
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt

    userId String
    user User @relation(field: [userId], references: [id], onDelete: Cascade)
}