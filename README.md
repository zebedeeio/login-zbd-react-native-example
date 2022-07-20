# Login With ZEBEDEE - React Native Example App

The [ZEBEDEE](https://zebedee.io) App is a Bitcoin/Lightning gaming wallet focused on user experience. It interfaces with the ZEBEDEE Internal APIs to make charges/requests/payments/withdrawals. The App is available for iOS and Android as it is built with React Native.

You can provide your users `Login With ZEBEDEE` by signing up on our [Developer Dashboard](https://dashboard.zebedee.io), getting keys and [setting that up](https://documentation.zebedee.io/) into your app.

## Source code

This is a simple ejected [Expo](https://expo.dev) project with the authentication settings added on `screens/TabOneScreen.tsx`.

### Setting your own OAuth2 keys

On order to try authenticating with ZEBEDEE, please go to the mentioned file, and replace the following lines accordingly:

```
  redirectUrl: 'com.zbdpartner.demo://authorize', // Set up your redirect Url
  clientId: '<your_client_id>',                   // Replace <your_client_id> with your actual client id
  clientSecret: '<your_client_secret>',           // Por testing purposes, the client secret is added here. On real case, it should be handled from back end for security reasons (refer to Docs)
```

Once that's set, you are ready to test the authentication.

## Development

For iOS development you will need a `macOS` machine and have the latest XCode installed. For Android development you need to install `Android Studio`.

Before starting make sure you have Node.js version **^16**.

Install dependencies with `yarn` (not `npm i`) - As sometimes it is used `expo-cli` to install dependencies (`expo install dependencie-name`), which has `yarn` as default package manager. Therefore there is a `yarn.lock` file to define our dependency versions.

- To start the React Native bundler (in case the app was already bult) run `yarn start`.
- To start the iOS app, you can run `yarn ios`.
- To start the Android app you can run `yarn android`.

## Troubleshooting and Support

If you find issues when setting Oauth2 on your app, please reach out to support@zebedee.io. We will be happy to assist you further =)
