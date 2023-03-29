import { User } from "./user.model";
import { File } from "./file";

export interface Dossier {
  id?: number;
  namedossier?: string;
  datedossier?: Date;
  user?: User;
  file?: File;
}
