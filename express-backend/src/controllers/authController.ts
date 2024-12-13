export class AuthController {
    private fakeUsers = [
        { email: "test@example.com", password: "password123" },
        { email: "user@example.com", password: "mypassword" }
    ];

    public verifyUser(email: string, password: string): boolean {
        const user = this.fakeUsers.find(user => user.email === email && user.password === password);
        return user !== undefined;
    }
}