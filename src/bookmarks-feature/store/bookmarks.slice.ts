import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialBookmarksState } from './bookmarks.state';
import { BookmarkModel } from '../models/bookmark.model';

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState: initialBookmarksState,
  reducers: {
    setBookmarksReducer: (state, action: PayloadAction<{ bookmarks: BookmarkModel[] }>) => {
      const { bookmarks } = action.payload;
      state.bookmarks = bookmarks;
    },

    setBookmarkReducer: (state, action: PayloadAction<{ bookmark: BookmarkModel }>) => {
      const { bookmark } = action.payload;

      const index = state.bookmarks.findIndex((item) => item.id === bookmark.id);

      if (index !== -1) {
        state.bookmarks[index] = bookmark;
      } else {
        state.bookmarks.push(bookmark);
      }
    },

    removeBookmarkReducer: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.bookmarks = state.bookmarks.filter((b) => b.id !== id);
    },
    setSelectedBookmarkReducer: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.selectedBookmarkId = id;
    },
    setLoadingReducer: (state, action: PayloadAction<{ loading: boolean }>) => {
      const { loading } = action.payload;
      state.loading = loading;
    },
  },
});

export const {
  setBookmarksReducer: setBookmarksAction,
  setBookmarkReducer: setBookmarkAction,
  removeBookmarkReducer: removeBookmarkAction,
  setSelectedBookmarkReducer: setSelectedBookmarkAction,
  setLoadingReducer: setLoadingAction,
} = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
