import { BookmarkCategoryModel } from '../models/bookmark-category.model';
import { BookmarkModel } from '../models/bookmark.model';

export interface BookmarksState {
  bookmarks: BookmarkModel[];
  selectedBookmarkId: string;
  loading: boolean;
  bookmarkCategories: BookmarkCategoryModel[];
}

export const initialBookmarksState: BookmarksState = {
  bookmarks: [],
  selectedBookmarkId: '',
  loading: false,
  bookmarkCategories: [],
};
