import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Keypair,
} from '@solana/web3.js';
import {useNavigation} from '@react-navigation/native';
import {RootScreenProp} from './RootStackPrams';
const Main = () => {
  const rootNavigation = useNavigation<RootScreenProp>();
  const [publicKey, setPublicKey] = useState<PublicKey>();
  const [keypair, setKeypair] = useState<Keypair>();
  const [balance, setBalance] = useState(0);

  const connection = async () => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    return connection;
  };

  const createWallet = () => {
    setBalance(0);
    const alice_keypair: Keypair = Keypair.generate();
    const alice_publicKey: PublicKey = alice_keypair.publicKey;
    setPublicKey(alice_publicKey);
    setKeypair(alice_keypair);
  };

  const balanc = async () => {
    const con = await connection();
    console.log(connection);

    let base58publicKey = new PublicKey(publicKey!);

    let balance = await con.getBalance(base58publicKey);
    setBalance(balance / LAMPORTS_PER_SOL);
  };

  const airdrop = async () => {
    const con = await connection();
    let base58publicKey = new PublicKey(publicKey!);

    const airdropSignature = await con.requestAirdrop(
      base58publicKey,
      LAMPORTS_PER_SOL,
    );

    const signature = await con.confirmTransaction(airdropSignature);

    await balanc();
  };

  return (
    <View style={styles.container}>
      <View style={styles.walletSection}>
        <View>
          <Text style={styles.header}>Your public key:</Text>
          <Text>{publicKey?.toString()}</Text>
        </View>
        <View>
          <Button
            onPress={createWallet}
            title="CREATE WALLET"
            color="#841584"
          />
        </View>
      </View>
      <View style={styles.balanceSection}>
        <View>
          <Text style={styles.header}>Your account balance:</Text>
          <Text>{balance} SOL</Text>
        </View>
        <View>
          <Button
            disabled={publicKey ? false : true}
            onPress={airdrop}
            title="AIRDROP"
            color="#841584"
          />
        </View>
      </View>
      <View style={styles.QR}>
        <View>
          <Text style={styles.header}>Scan and connect!</Text>
        </View>
        <View>
          <Button
            disabled={publicKey && balance ? false : true}
            onPress={() => {
              rootNavigation.navigate('QR', {
                publicKey: publicKey!,
                keypair: keypair!,
              });
            }}
            title="SCANN QR"
            color="#841584"
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 20,
    color: 'black',
  },
  walletSection: {
    justifyContent: 'center',
  },
  balanceSection: {},
  QR: {},
});
export default Main;
