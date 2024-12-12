export const apiClient = {
  auth: {
    signup: async ({ body }: { body: { username: string; email: string; password: string } }) => {
      // Placeholder implementation
      if (body.email === 'error@example.com') {
        return { body: { error: 'Email already in use' }, status: 400 };
      }
      return { body: {}, status: 200 };
    },
    login: async ({ body }: { body: { email: string; password: string } }) => {
      // Placeholder implementation
      if (body.email === 'error@example.com') {
        return { body: { error: 'Invalid credentials' }, status: 400 };
      }
      return { body: {}, status: 200 };
    },
    logout: async ({ body }: { body: {} }) => {
      // Placeholder implementation
      return { status: 200 };
    },
    validate: async () => {
      // Placeholder implementation
      return {
        body: {
          session: {
            id: 'session-id',
            token: 'session-token',
          },
          user: {
            username: 'testuser',
            role: 'user',
          },
        },
        status: 200,
      };
    },
  },
  user: {
    getInfo: async () => {
      // Placeholder implementation, hardcoded user info, replace this with data from db
      return {
        body: {
          username: 'testuser',
          email: 'test@testmail.com',
          role: 'USER',
        },
        status: 200,
      };
    },
  },
};