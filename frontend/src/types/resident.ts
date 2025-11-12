import type { Gender, RelationShip, ResidencyStatus } from "@/validation/authSchema";


export interface Resident {
    id: number,
    house_id: number,
    fullname: string,
    birth: string,
    gender: Gender,
    phone_number: string,
    relationship: RelationShip,
    residency_status: ResidencyStatus,
    move_in_date: string | null,
    move_out_date: string | null,
    created_at: string,
}