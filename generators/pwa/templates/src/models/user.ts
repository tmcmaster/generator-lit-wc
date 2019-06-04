import {Role} from "./role";

export class User {
  constructor(
    public id: string = '',
    public name: string = '',
    public role: Role = Role.GUEST,
    public enabled: boolean = false
  ) {}
}
