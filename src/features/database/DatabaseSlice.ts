import { createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit'
import { fetchAndSyncConfigData, initializeDatabase } from './Thunks';
import { ConfigSetting } from '../../config/config';
import { RootState } from '../../app/store';

interface Database {
  db: IDBDatabase | null,
  configData: ConfigSetting[],
  dBStatus: 'idle' | 'loading' | 'succeeded' | 'failed',
  fetchStatus: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: SerializedError | null
}

const initialState: Database = {
  db: null,
  configData: [],
  dBStatus: 'idle',
  fetchStatus: 'idle',
  error: null
}

const DatabaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.
      addCase(initializeDatabase.pending, (state) => {
        state.dBStatus = 'loading';
      })
      .addCase(initializeDatabase.fulfilled, (state, action: PayloadAction<IDBDatabase>) => {
        state.dBStatus = 'succeeded';
        state.db = action.payload;
      })
      .addCase(initializeDatabase.rejected, (state, action) => {
        state.dBStatus = 'failed';
        state.error = action.error
      })
      .addCase(fetchAndSyncConfigData.pending, (state) => {
        state.fetchStatus = 'loading';
      })
      .addCase(fetchAndSyncConfigData.fulfilled, (state, action: PayloadAction<ConfigSetting[]>) => {
        state.fetchStatus = 'succeeded';
        state.configData = action.payload;
      })
      .addCase(fetchAndSyncConfigData.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.error
      });
  }
});

export const selectConfigData = (state: RootState) => state.database.configData;
export const selectDatabase = (state: RootState) => state.database.db;
export const selectFetchStatus = (state: RootState) => state.database.fetchStatus;

export default DatabaseSlice.reducer