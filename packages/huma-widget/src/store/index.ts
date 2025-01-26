import {
  Action,
  ActionCreator,
  AnyAction,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit'

import widgetsReducers from './widgets.reducers'

export const store = configureStore({
  reducer: {
    widget: widgetsReducers,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
export type AppActionThunk<ReturnType = void> = ActionCreator<
  ThunkAction<ReturnType, RootState, unknown, AnyAction>
>
