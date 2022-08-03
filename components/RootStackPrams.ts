import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import {Keypair, PublicKey} from '@solana/web3.js';

export const RootStack = createStackNavigator();
export const InnerRootStack = createStackNavigator();
export const ModalsStack = createStackNavigator();

export type RootParamList = {
  MAIN: undefined;
  QR: {
    publicKey: PublicKey;
    keypair: Keypair;
  };
};

export type RootScreenProp = StackNavigationProp<RootParamList>;
