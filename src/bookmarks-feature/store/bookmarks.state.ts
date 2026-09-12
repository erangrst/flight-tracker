import { BookmarkModel } from '../models/bookmark.model';

export interface BookmarksState {
  bookmarks: BookmarkModel[];
  selectedBookmarkId: string;
  loading: boolean;
}

export const initialBookmarksState: BookmarksState = {
  bookmarks: [],
  selectedBookmarkId: '',
  loading: false,
};
