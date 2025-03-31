declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

declare module "../services/authService.ts" {
  const AuthService: any;
  export default AuthService;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}
