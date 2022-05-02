export interface RequestWithUser {
  body: any;
  user: {
    uuid: string;
    email: string;
    name: string;
    role: string;
  };
}
