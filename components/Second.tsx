import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {ClientSolana, SignTransactionsRequest} from '@nightlylabs/connect';
import {useNavigation} from '@react-navigation/native';
import {RootScreenProp} from './RootStackPrams';
import {Keypair, PublicKey} from '@solana/web3.js';
import {Transaction} from '@solana/web3.js';
import {Buffer} from 'buffer';
global.Buffer = global.Buffer || require('buffer').Buffer;

export interface IPropsSolana {
  route: {
    params: {
      publicKey: PublicKey;
      keypair: Keypair;
    };
  };
}
const Second: React.FC<IPropsSolana> = ({route}) => {
  const publicKey = route.params.publicKey;
  const keypair = route.params.keypair;
  const rootNavigation = useNavigation<RootScreenProp>();

  const onSuccess = async (e: {data: string}) => {
    console.log(e.data);
    const url = new URL(e.data);
    const network = url.searchParams.get('network');

    const temp = e.data.substring(e.data.indexOf(':') + 1);
    const sessionId: string = temp.substring(0, temp.indexOf('?'));

    switch (network) {
      case 'SOLANA':
        try {
          let {client, data} = await ClientSolana.build({
            sessionId: sessionId,
          });

          console.log(data);

          await client.connect({
            publicKey: publicKey, // PublicKey: required
            sessionId: sessionId, // string: required
            //token: token // string: optional for push notification purposes only
          });

          client.on('newRequest', async request => {
            const signRequest = request as SignTransactionsRequest;

            // Sign request
            const txToSign = Transaction.from(
              Buffer.from(signRequest.transactions[0], 'hex'),
            );

            txToSign.sign(keypair);

            // Send signed transaction
            await client.resolveSignTransaction({
              requestId: signRequest.id,
              signedTransactions: [txToSign],
            });
          });
        } catch (error) {
          console.log(error);
        }
    }
  };
  return (
    <View style={{flex: 2}}>
      <QRCodeScanner
        onRead={onSuccess}
        showMarker={true}
        flashMode={RNCamera.Constants.FlashMode.off}
        bottomContent={
          <TouchableOpacity onPress={() => rootNavigation.navigate('MAIN')}>
            <Text>BACK</Text>
          </TouchableOpacity>
        }
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8e7e3',
  },
});
export default Second;
