import { BookmarkModel } from '../models/bookmark.model';
import { setBookmarkAction, removeBookmarkAction, setBookmarksAction, setLoadingAction, setSelectedBookmarkAction } from './bookmarks.slice';
import { store } from '../../infra/redux/store';

export function setBookmarks(bookmarks: BookmarkModel[]): void {
  store.dispatch(setBookmarksAction({ bookmarks }));
}

export function setBookmark(bookmark: BookmarkModel): void {
  store.dispatch(setBookmarkAction({ bookmark }));
}

export function removeBookmark(id: string): void {
  store.dispatch(removeBookmarkAction({ id }));
}

export function setSelectedBookmark(id: string): void {
  store.dispatch(setSelectedBookmarkAction({ id }));
}

export function setLoading(loading: boolean): void {
  store.dispatch(setLoadingAction({ loading }));
}
