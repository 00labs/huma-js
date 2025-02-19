import { LoggingContextHelper } from '@huma-finance/web-shared'
import { RootState } from '.'

export const selectWidgetState = (state: RootState) => state.widget

let cachedContext: LoggingContextHelper | null = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedLoggingContext: any = null

export const selectWidgetLoggingContext = (
  state: RootState,
): LoggingContextHelper => {
  if (state.widget.loggingContext === cachedLoggingContext) {
    return cachedContext!
  }

  cachedLoggingContext = state.widget.loggingContext
  cachedContext = state.widget.loggingContext
    ? new LoggingContextHelper(state.widget.loggingContext)
    : new LoggingContextHelper()

  return cachedContext
}
