// src/validation/authSchema.ts
import { z } from "zod"

export const RoleEnum = z.enum(["admin", "manager", "resident", "accountant"])
export const StatusEnum = z.enum(["active", "inactive"])
export const RelationShipEnum = z.enum(["chusohuu", "nguoidaidien", "thanhvien", "nguoithue"])
export const GenderEnum = z.enum(["male", "female", "other"])
export const ResidencyStatusEnum = z.enum(["thuongtru", "tamtru", "tamvang"]) 

export const otpSchema = z.string().length(6, "Mã OTP phải gồm 6 chữ số")

export const signUpSchema = z.object({
  fullname: z.string().min(1, "Không được để trống"),
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  role: RoleEnum,
  resident_id: z.number().optional().nullable(),
})

export const signInSchema =  z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

export type RelationShip = z.infer<typeof RelationShipEnum>
export type Role = z.infer<typeof RoleEnum>
export type Status = z.infer<typeof StatusEnum>
export type Gender = z.infer<typeof GenderEnum>
export type ResidencyStatus = z.infer<typeof ResidencyStatusEnum>
export type SignUpFormValues = z.infer<typeof signUpSchema>
export type SignInFormValues = z.infer<typeof signInSchema>
export type OTPValues = z.infer<typeof otpSchema>