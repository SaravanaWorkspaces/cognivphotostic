import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    strapiToken?: string;
  }
  interface Session {
    user: {
      id:          string;
      name:        string;
      email:       string;
      strapiToken: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?:          string;
    strapiToken?: string;
  }
}
