# Express Backend Authentication Project

This project is an Express backend application that handles user authentication. It verifies user credentials against a set of predefined fake data.

## Project Structure

```
express-backend
├── src
│   ├── app.ts                  # Entry point of the application
│   ├── controllers
│   │   └── authController.ts   # Handles user authentication logic
│   ├── routes
│   │   └── authRoutes.ts       # Sets up authentication routes
│   ├── data
│   │   └── fakeUsers.ts        # Contains fake user data for testing
│   └── types
│       └── index.ts            # Defines TypeScript interfaces
├── package.json                 # npm configuration file
├── tsconfig.json                # TypeScript configuration file
└── README.md                    # Project documentation
```

## Getting Started

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd express-backend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:3000/event-info`.

## API Endpoints

- **POST /login**
  - Request Body: 
    - email: string
    - password: string
  - Description: Authenticates the user by verifying the provided email and password against the fake user data.

## Testing

The application includes a set of fake user credentials for testing purposes. You can modify the `src/data/fakeUsers.ts` file to add or change user data as needed.

## License

This project is licensed under the MIT License.