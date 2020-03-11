
# mNeme Back End

The deployed backend is on [Heroku](https://flashcards-be.herokuapp.com/).

### Getting Started

To run the server locally:

- Clone the repo
- `npm i` to install all the dependencies
- `npm run server` to start the server

### Tech Stack

The backend was built using:

- NodeJS
- ExpressJS
- Firebase
- Swagger (for documentation)

### Dependencies

```javascript
  "dependencies": {
    "@firebase/testing": "^0.16.3",
    "cors": "^2.8.5",
    "dotenv": "^8.2.0",
    "express": "^4.17.1",
    "firebase-admin": "^8.8.0",
    "helmet": "^3.21.2",
    "jest": "^24.9.0",
    "swagger-jsdoc": "^3.5.0",
    "swagger-ui-express": "^4.1.2",
    "uuid": "^3.4.0"
  },
  "devDependencies": {
    "mocha": "^7.0.0",
    "nodemon": "^2.0.2"
  }
```

### Endpoint Documentation

All endpoint documentation was done using Swagger and can be found [here](https://flashcards-be.herokuapp.com/api-docs/).

### Environment Variables

There are some necessary environment variables for the server to run. These are all for Firebase's Admin SDK so that the server can connect with a Firestore Database.

```javascript
* SERVICE_TYPE
* SERVICE_PROJECT_ID
* SERVICE_PRIVATE_KEY_ID
* SERVICE_PRIVATE_KEY
* SERVICE_CLIENT_EMAIL
* SERVICE_CLIENT_ID
* SERVICE_AUTH_URI
* SERVICE_TOKEN_URI
* SERVICE_AUTH_PROVIDER_X509_CERT_URL
* SERVICE_AUTH_CLIENT_X509_CERT_URL
```

Once you have created a Firebase Application to connect to your locally run server you can assign each of the values from your personal Firebase App to these Environment Variables to connect the server to your Firestore.

# template-web-backend
run `firebase emulators:exec --only firestore 'npm test'` in the terminal to run the test files on the firestore emulator

(https://api.codeclimate.com/v1/badges/3a3bae56d35e95f06018/test_coverage)
