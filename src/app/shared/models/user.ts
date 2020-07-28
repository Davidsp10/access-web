export class User {
    id: number;
    username: string;
    surname: string;
    password: string;
    email: string;
    enabled: boolean;
    roles: string[] = [];

}