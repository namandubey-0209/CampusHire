import 'next-auth';
import { DefaultSession } from 'next-auth';
import { Types } from 'mongoose';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      name?: string;
      role?: string;
    };
  }

  interface User {
    _id?: string;
    name?: string;
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    name?: string;
    role?: string;
  }
}