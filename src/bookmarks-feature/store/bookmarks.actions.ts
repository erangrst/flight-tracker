import { BookmarkCategoryModel } from '../models/bookmark-category.model';
import { BookmarkModel } from '../models/bookmark.model';
import {
  setBookmarkAction,
  removeBookmarkAction,
  setBookmarksAction,
  setBookmarkCategoriesAction,
  setLoadingAction,
  setSelectedBookmarkAction,
} from './bookmarks.slice';
import { store } from '../../infra/redux/store';

export function dispatchSetBookmarks(bookmarks: BookmarkModel[]): void {
  store.dispatch(setBookmarksAction({ bookmarks }));
}

export function dispatchSetBookmark(bookmark: BookmarkModel): void {
  store.dispatch(setBookmarkAction({ bookmark }));
}

export function dispatchRemoveBookmark(id: string): void {
  store.dispatch(removeBookmarkAction({ id }));
}

export function dispatchSetSelectedBookmark(id: string): void {
  store.dispatch(setSelectedBookmarkAction({ id }));
}

export function dispatchSetLoading(loading: boolean): void {
  store.dispatch(setLoadingAction({ loading }));
}

export function dispatchSetBookmarkCategories(bookmarkCategories: BookmarkCategoryModel[]): void {
  store.dispatch(setBookmarkCategoriesAction({ bookmarkCategories }));
}
