import { ChainEnum } from '../../src/utils/chain'
import { POOL_NAME, getPoolInfoForPoolAddress } from '../../src/utils/pool'

test('getPoolInfoForPoolAddress', () => {
  let poolInfo = getPoolInfoForPoolAddress(
    ChainEnum.Goerli,
    '0x11672c0bBFF498c72BC2200f42461c0414855042',
  )

  expect(poolInfo?.poolName).toBe(POOL_NAME.RequestNetwork)

  poolInfo = getPoolInfoForPoolAddress(
    ChainEnum.Goerli,
    '0x0000000000000000000000000000000000000000',
  )

  expect(poolInfo).toBeNull()
})
