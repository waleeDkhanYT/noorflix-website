import { configureStore } from "@reduxjs/toolkit";
import { tmdbApi } from "./api/tmdbApi";
import { watchmodeApi } from "./api/watchmodeApi";
import { omdbApi } from "./api/omdbApi";
import { ratingsApi } from "./api/ratingsApi";
import authReducer from "./slices/authSlice";
import watchlistReducer from "./slices/watchlistSlice";
import preferencesReducer from "./slices/preferencesSlice";
import { watchlistListenerMiddleware } from "./listeners/watchlistPersist";
import { authListenerMiddleware } from "./listeners/authListener";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      watchlist: watchlistReducer,
      preferences: preferencesReducer,
      [tmdbApi.reducerPath]: tmdbApi.reducer,
      [watchmodeApi.reducerPath]: watchmodeApi.reducer,
      [omdbApi.reducerPath]: omdbApi.reducer,
      [ratingsApi.reducerPath]: ratingsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        authListenerMiddleware.middleware,
        watchlistListenerMiddleware.middleware,
        tmdbApi.middleware,
        watchmodeApi.middleware,
        omdbApi.middleware,
        ratingsApi.middleware
      ),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];