import { BookmarksState } from './bookmarks.state';

export interface BookmarksRootState {
  bookmarks: BookmarksState;
}

export const bookmarksSelector = (state: BookmarksRootState) => state.bookmarks.bookmarks;

export const selectedBookmarkIdSelector = (state: BookmarksRootState) => state.bookmarks.selectedBookmarkId;

export const loadingSelector = (state: BookmarksRootState) => state.bookmarks.loading;

export const bookmarkCategoriesSelector = (state: BookmarksRootState) => state.bookmarks.bookmarkCategories;
