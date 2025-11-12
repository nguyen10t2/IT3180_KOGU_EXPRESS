import type { Role, Status } from "@/validation/authSchema"

export interface User {
    id: number,
    fullname: string,
    email: string,
    role: Role,
    status ?: Status,
    create_at ?: string,
    resident_id ?: number,
}