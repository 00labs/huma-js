export const getLenderLockupDates = (
  withdrawalLockupPeriodDays: number,
): { lockupEndTimeUnix: number; withdrawTimeUnix: number } => {
  const now = new Date()
  const lockupEndTime = new Date(now.getFullYear(), now.getMonth(), 1)
  lockupEndTime.setDate(
    lockupEndTime.getDate() + (withdrawalLockupPeriodDays ?? 0),
  )

  const withdrawTime = new Date(
    lockupEndTime.getFullYear(),
    lockupEndTime.getMonth() + 1,
    lockupEndTime.getDate(),
  )

  // Get Unix timestamps in seconds
  const lockupEndTimeUnix = Math.floor(lockupEndTime.getTime() / 1000)
  const withdrawTimeUnix = Math.floor(withdrawTime.getTime() / 1000)

  return { lockupEndTimeUnix, withdrawTimeUnix }
}
