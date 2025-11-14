import "express";

declare global {
  namespace Express {
    interface UserPayload {
      id: number;
      correo: string;
      role: string;
      nombre?: string;
      apellido?: string;
      iat?: number;
      exp?: number;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}
