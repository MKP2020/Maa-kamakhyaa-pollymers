export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: "admin" | "employee" | "client";
    };
  }
}
