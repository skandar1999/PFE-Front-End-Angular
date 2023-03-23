import { User } from "./user.model";

export interface File {
  id?: number;
  name?: string;
  path?: string;
  date?: Date;
  user?: User;
}
