// src/types/express/index.d.ts
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        jti:string;
        name:string;
        email:string;
      };
    }
  }
}
