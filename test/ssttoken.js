const SSTToken = artifacts.require('SSTToken')

const amount = (value) => {
  return web3.utils.fromWei(value).toString()
}

contract('SSTToken', (accounts) => {
  it('should initialise owner with 1000000', async () => {
    const instance = await SSTToken.deployed()
    const balance = await instance.balanceOf.call(accounts[0])

    assert.equal(
      amount(balance),
      '1000000',
      "1000000 wasn't in the first account",
    )
  })

  describe('transfer', () => {
    it('should transfer from caller to recipient', async () => {
      const instance = await SSTToken.deployed()
      await instance.transfer(accounts[1], '100', { from: accounts[0] })

      const callerBalance = await instance.balanceOf.call(accounts[0])
      assert.equal(
        amount(callerBalance),
        '999900',
        "999900 wasn't in the first account",
      )

      const recipientBalance = await instance.balanceOf.call(accounts[1])
      assert.equal(
        amount(recipientBalance),
        '100',
        "100 wasn't in the second account",
      )
    })
  })

  describe('mint', () => {
    it('should add amount to recipient', async () => {
      const instance = await SSTToken.deployed()
      await instance.mint(accounts[1], '100', { from: accounts[0] })

      const balance = await instance.balanceOf.call(accounts[1])
      assert.equal(amount(balance), '200', "200 wasn't in the first account")
    })

    it('should caller be owner only', async () => {
      const instance = await SSTToken.deployed()
      await instance.mint(accounts[1], '100', { from: accounts[2] })

      const balance = await instance.balanceOf.call(accounts[1])
      assert.equal(amount(balance), '200', "200 wasn't in the first account")
    })
  })

  /* it('should call a function that depends on a linked library', async () => {
    const metaCoinInstance = await MetaCoin.deployed();
    const metaCoinBalance = (await metaCoinInstance.getBalance.call(accounts[0])).toNumber();
    const metaCoinEthBalance = (await metaCoinInstance.getBalanceInEth.call(accounts[0])).toNumber();

    assert.equal(metaCoinEthBalance, 2 * metaCoinBalance, 'Library function returned unexpected function, linkage may be broken');
  });
  it('should send coin correctly', async () => {
    const metaCoinInstance = await MetaCoin.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoStartingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await metaCoinInstance.sendCoin(accountTwo, amount, { from: accountOne });

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoEndingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();


    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  }); */
})
