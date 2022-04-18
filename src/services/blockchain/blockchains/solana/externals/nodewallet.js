import { Buffer } from 'buffer';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';

/**
 * Node only wallet.
 */
export default class NodeWallet {
    //  constructor(readonly payer: Keypair) {}

    constructor(keypair) {
        this.payer = keypair;
    }

    /*
  static local() {
    const payer = Keypair.fromSecretKey(
      Buffer.from([250,198,88,219,95,186,86,42,141,139,158,202,48,60,49,34,120,169,71,222,72,218,184,243,52,128,63,244,245,30,61,29,0,73,114,112,87,75,67,11,212,182,193,17,29,222,23,63,5,89,155,72,191,85,51,105,87,89,155,55,11,21,29,75])
//			Buffer.from([229,36,24,101,176,92,19,217,94,77,168,220,81,116,83,107,243,67,154,90,216,199,125,81,3,60,223,139,250,63,167,60,127,58,183,116,207,166,144,192,183,46,66,22,237,186,229,191,130,230,225,210,117,251,62,8,82,28,134,109,46,180,114,75])
				/*
        JSON.parse(
          require("fs").readFileSync(process.env.ANCHOR_WALLET, {
            encoding: "utf-8",
          })
        )
    );

		console.log('payer',payer)
    return new NodeWallet(payer);
  }

*/

    async signTransaction(tx) {
        tx.partialSign(this.payer);
        return tx;
    }

    async signAllTransactions(txs) {
        return txs.map((t) => {
            t.partialSign(this.payer);
            return t;
        });
    }

    get publicKey() {
        console.log(this);
        return this.payer.publicKey;
    }
}
