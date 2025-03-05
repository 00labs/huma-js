import { useEffect, useRef } from 'react'
import { LoggingActions } from '@huma-finance/web-shared'
import { selectWidgetLoggingContext } from '../store/widgets.selectors'
import { useAppSelector } from './useRedux'

const useLogOnFirstMount = (action: LoggingActions, data: object = {}) => {
  const loggingHelper = useAppSelector(selectWidgetLoggingContext)
  const hasLogged = useRef(false)

  useEffect(() => {
    // Only log the action once
    if (!hasLogged.current) {
      loggingHelper.logAction(action, data)
      hasLogged.current = true
    }
  }, [action, data, loggingHelper])
}

export default useLogOnFirstMount
