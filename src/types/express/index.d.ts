import { Request } from "express"

export interface AuthenticatedRequest extends Request {
    auth: { id: string; email: string }
}
