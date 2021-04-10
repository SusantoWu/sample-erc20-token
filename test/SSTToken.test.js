const { expectRevert } = require('@openzeppelin/test-helpers')

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
      await expectRevert(
        instance.mint(accounts[1], '100', { from: accounts[2] }),
        'Ownable: caller is not the owner',
      )
    })
  })

  describe('burn', () => {
    it('should reduce caller token amount', async () => {
      const instance = await SSTToken.deployed()
      await instance.burn('100', { from: accounts[0] })

      const balance = await instance.balanceOf.call(accounts[0])
      assert.equal(
        amount(balance),
        '999800',
        "999800 wasn't in the first account",
      )
    })

    it('should caller be owner only', async () => {
      const instance = await SSTToken.deployed()
      await expectRevert(
        instance.burn('100', { from: accounts[2] }),
        'Ownable: caller is not the owner',
      )
    })
  })

  describe('lock', () => {
    it('should target locked', async () => {
      const instance = await SSTToken.deployed()
      await instance.lock(accounts[1], true, { from: accounts[0] })

      const locked = await instance.locked.call(accounts[1])
      assert.equal(locked, true, "target wasn't lock")
    })

    it('should caller be owner only', async () => {
      const instance = await SSTToken.deployed()
      await expectRevert(
        instance.lock(accounts[1], true, { from: accounts[2] }),
        'Ownable: caller is not the owner',
      )
    })

    it('should prevent target activity', async () => {
      const instance = await SSTToken.deployed()
      await expectRevert(
        instance.transfer(accounts[1], '100', { from: accounts[0] }),
        'SSTToken: to address is locked',
      )
      await expectRevert(
        instance.transfer(accounts[2], '100', { from: accounts[1] }),
        'SSTToken: from address is locked',
      )
    })
  })
})
