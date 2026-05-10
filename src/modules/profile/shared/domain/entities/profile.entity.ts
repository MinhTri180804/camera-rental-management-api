export class Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatar: {
    public_id: string;
    version: number;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}
