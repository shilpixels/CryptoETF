import AbstractWallet from './AbstractWallet'
import Coin from '../Coin'
// noinspection NpmUsedModulesInstalled
import KrakenClient from 'kraken-api'

export default class KrakenWallet extends AbstractWallet {
  /**
   * Returns the balances for a Kraken account.
   * @param credential The Kraken api credentials.
   * @return {Promise} The account balances.
   */
  static _getBalanceForCredential(credential) {
    return new Promise((resolve, reject) => {
          const kraken = new KrakenClient(credential.apiKey, credential.apiSecret, {timeout: 10000})
          // noinspection JSCheckFunctionSignatures
          kraken.api('Balance', function(err, data) {
            if (err) {
              return reject(err)
            }
            let result = []
            let balances = data.result
            for (let symbol in balances) {
              let amount = balances[symbol]
              if (symbol.length === 4 && symbol[0] === 'X') {
                symbol = symbol.substr(1, 3)
              }
              result.push(new Coin(symbol, amount, 'Kraken'))
            }
            resolve(result)
          })
        }
    )
  }
}