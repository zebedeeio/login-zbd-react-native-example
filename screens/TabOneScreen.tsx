import * as React from 'react';
import {
  StyleSheet,
  Button,
  AsyncStorage,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import * as AppAuth from 'expo-app-auth';

let config = {
  useNonce: false,
  clientAuthMethod: 'post',
  serviceConfiguration: {
    authorizationEndpoint: `https://api.zebedee.io/v0/oauth2/authorize`,
    tokenEndpoint: `https://api.zebedee.io/v0/oauth2/token`,
  },
  scopes: ['user'],
  redirectUrl: 'com.zbdpartner.demo://authorize',
  clientId: '<your_client_id>',
  clientSecret: '<your_client_secret>',
};

type AuthProps = {
  accessToken: any;
} | null;

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>): JSX.Element {
  let [authState, setAuthState] = React.useState<AuthProps>(null);
  let [userData, setUserData] =
    React.useState<{
      email: string;
      gamertag: string;
    } | null>(null);

  React.useEffect(() => {
    (async () => {
      let cachedAuth = await getCachedAuthAsync();
      if (cachedAuth && !authState) {
        setAuthState(cachedAuth);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      if (authState) {
        const tempUserData = await (
          await fetch('https://api.zebedee.io/v0/oauth2/user', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authState?.accessToken}`,
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
          })
        )?.json();
        if (tempUserData) setUserData(tempUserData?.data);
      }
    })();
  }, [authState]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AmazinGame</Text>
      <Text style={{ ...styles.desc, marginBottom: 2 }}>
        Have fun while earning
      </Text>
      <Text style={styles.desc}>some Satoshis</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <TouchableOpacity
        style={{
          width: '100%',
          height: 80,
        }}
        onPress={async () => {
          const _authState: any = await signInAsync();
          setAuthState(_authState);
        }}
      >
        <Image
          style={{ width: '100%', height: 60 }}
          resizeMode="contain"
          source={require('../assets/images/zebedee-medium.png')}
        />
      </TouchableOpacity>
      <View
        style={{ ...styles.separator, marginVertical: 15 }}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {authState?.['accessToken'] && (
        <Button
          title="Sign Out "
          onPress={async () => {
            await signOutAsync(authState);
            setAuthState(null);
            setUserData(null);
          }}
        />
      )}
      {userData && (
        <View style={{ width: '100%' }}>
          <Text style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>Email:</Text>
            {`  ${userData?.email}`}
          </Text>
          <Text style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>Gamertag:</Text>
            {`  ${userData?.gamertag}`}
          </Text>
        </View>
      )}
      {authState?.['accessToken'] && (
        <View style={{ width: '100%' }}>
          <Text style={{ paddingHorizontal: 16, paddingVertical: 4 }}>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>
              Access Token:{' '}
            </Text>
            {`${authState?.['accessToken'].slice(0, 250).concat('...')}`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  desc: {
    fontSize: 16,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

let StorageKey = '@MyApp:CustomGoogleOAuthKey';

export async function signInAsync() {
  let authState = await AppAuth.authAsync(config);
  await cacheAuthAsync(authState);
  console.log('signInAsync', authState);
  return authState;
}

async function cacheAuthAsync(authState: any) {
  return await AsyncStorage.setItem(StorageKey, JSON.stringify(authState));
}

export async function getCachedAuthAsync() {
  let value = await AsyncStorage.getItem(StorageKey);
  let authState = value ? JSON.parse(value) : '';
  console.log('getCachedAuthAsync', authState);
  if (authState) {
    if (checkIfTokenExpired(authState)) {
      return refreshAuthAsync(authState);
    } else {
      return authState;
    }
  }
  return null;
}

function checkIfTokenExpired({ accessTokenExpirationDate }) {
  return new Date(accessTokenExpirationDate) < new Date();
}

async function refreshAuthAsync({ refreshToken }) {
  let authState = await AppAuth.refreshAsync(config, refreshToken);
  console.log('refreshAuth', authState);
  await cacheAuthAsync(authState);
  return authState;
}

export async function signOutAsync({ accessToken }) {
  try {
    await AppAuth.revokeAsync(config, {
      token: accessToken,
      isClientIdProvided: true,
    });
    await AsyncStorage.removeItem(StorageKey);
    return null;
  } catch (e) {
    alert(`Failed to revoke token: ${e.message}`);
  }
}
