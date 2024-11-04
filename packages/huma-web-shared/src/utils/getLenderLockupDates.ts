export const getLenderLockupDates = (
  withdrawalLockupPeriodDays: number,
): { lockupEndTimeUnix: number; withdrawTimeUnix: number } => {
  const now = new Date()
  const lockupEndTime = new Date(now)

  // Add withdrawalLockupPeriodDays to the current date
  lockupEndTime.setDate(
    lockupEndTime.getDate() + (withdrawalLockupPeriodDays ?? 0),
  )
  // Set the day of lockupEndTime to the first of that month
  lockupEndTime.setDate(1)

  // Calculate withdrawTime by adding 1 month to lockupEndTime
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
