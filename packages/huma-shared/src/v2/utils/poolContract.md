```javascript
const getFixedYieldAPY = () => {
  const seniorJuniorRatio = 4
  const APY = 0.15
  const protocolFee = 0.05
  const rewardRateForPoolOwner = 0.02
  const rewardRateForEA = 0.03
  const seniorAssets = 80
  const juniorAssets = 20
  const seniorFixedAPY = 0.1
  const utilizationRate = 1
  const flcAssets = 20

  let totalProfit = (seniorAssets + juniorAssets) * APY * utilizationRate

  let trancheAndFlcProfit =
    (1 - protocolFee) * totalProfit -
    (rewardRateForPoolOwner + rewardRateForEA) *
      ((1 - protocolFee) * totalProfit)

  trancheAndFlcProfit =
    (1 - rewardRateForPoolOwner - rewardRateForEA) *
    (1 - protocolFee) *
    totalProfit

  trancheAndFlcProfit =
    (1 - rewardRateForPoolOwner - rewardRateForEA) *
    (1 - protocolFee) *
    (seniorAssets + juniorAssets) *
    APY *
    utilizationRate

  let poolProfitRatio =
    (1 - rewardRateForPoolOwner - rewardRateForEA) * (1 - protocolFee)

  trancheAndFlcProfit =
    poolProfitRatio * (seniorAssets + juniorAssets) * APY * utilizationRate

  let juniorAndFlcProfit = trancheAndFlcProfit - seniorAssets * seniorFixedAPY

  let juniorAndFlcTotalAssets = juniorAssets + flcAssets

  let juniorProfit =
    juniorAndFlcProfit -
    (juniorAndFlcProfit * flcAssets) / juniorAndFlcTotalAssets

  juniorProfit = (1 - flcAssets / juniorAndFlcTotalAssets) * juniorAndFlcProfit

  juniorProfit =
    (1 - flcAssets / juniorAndFlcTotalAssets) *
    (trancheAndFlcProfit - seniorAssets * seniorFixedAPY)

  let juniorProfitRatio = 1 - flcAssets / juniorAndFlcTotalAssets

  juniorProfit =
    juniorProfitRatio * (trancheAndFlcProfit - seniorAssets * seniorFixedAPY)

  let juniorAPY = juniorProfit / juniorAssets

  juniorAPY =
    (juniorProfitRatio *
      (trancheAndFlcProfit - seniorAssets * seniorFixedAPY)) /
    juniorAssets

  juniorAPY =
    juniorProfitRatio *
    (trancheAndFlcProfit / juniorAssets - seniorJuniorRatio * seniorFixedAPY)

  juniorAPY =
    juniorProfitRatio *
    ((poolProfitRatio * (seniorAssets + juniorAssets) * APY * utilizationRate) /
      juniorAssets -
      seniorJuniorRatio * seniorFixedAPY)

  juniorAPY =
    juniorProfitRatio *
    (poolProfitRatio * (seniorJuniorRatio + 1) * APY * utilizationRate -
      seniorJuniorRatio * seniorFixedAPY)

  let flcAPY =
    (1 - juniorProfitRatio) *
    (poolProfitRatio * (seniorJuniorRatio + 1) * APY * utilizationRate -
      seniorJuniorRatio * seniorFixedAPY)

  return {
    seniorAPY: seniorFixedAPY,
    juniorAPY,
    flcAPY,
  }
}

const getRiskAdjustedYieldAPY = () => {
  const seniorJuniorRatio = 4
  const APY = 0.15
  const protocolFee = 0.05
  const rewardRateForPoolOwner = 0.02
  const rewardRateForEA = 0.03
  const seniorAssets = 80
  const juniorAssets = 20
  const riskAdjustment = 0.2
  const utilizationRate = 1
  const flcAssets = 10

  let totalProfit = (seniorAssets + juniorAssets) * APY * utilizationRate

  let trancheAndFlcProfit =
    (1 - protocolFee) * totalProfit -
    (rewardRateForPoolOwner + rewardRateForEA) *
      ((1 - protocolFee) * totalProfit)

  trancheAndFlcProfit =
    (1 - rewardRateForPoolOwner - rewardRateForEA) *
    (1 - protocolFee) *
    totalProfit

  trancheAndFlcProfit =
    (1 - rewardRateForPoolOwner - rewardRateForEA) *
    (1 - protocolFee) *
    (seniorAssets + juniorAssets) *
    APY *
    utilizationRate

  let poolProfitRatio =
    (1 - rewardRateForPoolOwner - rewardRateForEA) * (1 - protocolFee)

  trancheAndFlcProfit =
    poolProfitRatio * (seniorAssets + juniorAssets) * APY * utilizationRate

  let seniorProfitBeforeAdjustment =
    (trancheAndFlcProfit * seniorAssets) / (seniorAssets + juniorAssets)

  seniorProfitBeforeAdjustment =
    (poolProfitRatio *
      (seniorAssets + juniorAssets) *
      APY *
      utilizationRate *
      seniorAssets) /
    (seniorAssets + juniorAssets)

  seniorProfitBeforeAdjustment =
    poolProfitRatio * APY * utilizationRate * seniorAssets

  let seniorProfit = (1 - riskAdjustment) * seniorProfitBeforeAdjustment

  seniorProfit =
    poolProfitRatio *
    (1 - riskAdjustment) *
    APY *
    utilizationRate *
    seniorAssets

  let seniorAPY = seniorProfit / seniorAssets

  seniorAPY =
    (poolProfitRatio *
      (1 - riskAdjustment) *
      APY *
      utilizationRate *
      seniorAssets) /
    seniorAssets

  seniorAPY = poolProfitRatio * (1 - riskAdjustment) * APY * utilizationRate

  let juniorAndFlcTotalAssets = juniorAssets + flcAssets

  let juniorProfitRatio = 1 - flcAssets / juniorAndFlcTotalAssets

  let juniorAndFlcProfit = trancheAndFlcProfit - seniorProfit

  let juniorProfit = juniorProfitRatio * juniorAndFlcProfit

  juniorProfit = juniorProfitRatio * (trancheAndFlcProfit - seniorProfit)

  juniorProfit =
    juniorProfitRatio *
    (poolProfitRatio * (seniorAssets + juniorAssets) * APY * utilizationRate -
      poolProfitRatio *
        (1 - riskAdjustment) *
        APY *
        utilizationRate *
        seniorAssets)

  juniorProfit =
    juniorProfitRatio *
    poolProfitRatio *
    utilizationRate *
    ((seniorAssets + juniorAssets) * APY -
      (1 - riskAdjustment) * APY * seniorAssets)

  let juniorAPY = juniorProfit / juniorAssets

  juniorAPY =
    (juniorProfitRatio *
      poolProfitRatio *
      utilizationRate *
      ((seniorAssets + juniorAssets) * APY -
        (1 - riskAdjustment) * APY * seniorAssets)) /
    juniorAssets

  juniorAPY =
    juniorProfitRatio *
    poolProfitRatio *
    utilizationRate *
    (((seniorAssets + juniorAssets) * APY) / juniorAssets -
      ((1 - riskAdjustment) * APY * seniorAssets) / juniorAssets)

  juniorAPY =
    juniorProfitRatio *
    poolProfitRatio *
    utilizationRate *
    ((seniorJuniorRatio + 1) * APY -
      (1 - riskAdjustment) * APY * seniorJuniorRatio)

  juniorAPY =
    juniorProfitRatio *
    poolProfitRatio *
    utilizationRate *
    ((seniorJuniorRatio +
      1 -
      seniorJuniorRatio +
      riskAdjustment * seniorJuniorRatio) *
      APY)

  juniorAPY =
    juniorProfitRatio *
    poolProfitRatio *
    utilizationRate *
    ((1 + riskAdjustment * seniorJuniorRatio) * APY)

  let flcAPY =
    (1 - juniorProfitRatio) *
    poolProfitRatio *
    utilizationRate *
    ((1 + riskAdjustment * seniorJuniorRatio) * APY)

  seniorAPY = poolProfitRatio * (1 - riskAdjustment) * APY

  return {
    seniorAPY,
    juniorAPY,
    flcAPY,
  }
}
```
