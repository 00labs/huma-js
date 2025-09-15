import PermissionlessIDL from './permissionless.json'
import StakeIDL from './stake.json'

export * as HumaSolana from './huma'
export * from './localhost'
export * from './permissionless'
export { PermissionlessIDL }

export type { VoterStakeRegistry as PermissionlessVoter } from './stake'
export { StakeIDL as PermissionlessVoterIDL }
