import { CommonResponseModel } from '../../models/api/common-response.model';
import { BookmarkCategoryModel } from '../models/bookmark-category.model';
import { BookmarkModel } from '../models/bookmark.model';
import { deleteBookmarksApi, getBookmarksApi, upsertBookmarksApi } from '../proxy/bookmarks.proxy';
import { dispatchRemoveBookmark, dispatchSetBookmark, dispatchSetBookmarkCategories, dispatchSetBookmarks } from '../store/bookmarks.actions';
import { addSlice } from '../../infra/redux/store';
import bookmarksReducer from '../store/bookmarks.slice';
import { showNotification } from '../../infra/notifications/toast-notifier';

export function initBookmarks() {
  addSlice('bookmarks', bookmarksReducer);

  loadBookmarkCategories();
  loadBookmarks();
}

export async function loadBookmarkCategories(): Promise<void> {
  try {
    const response = await fetch('assets/bookmarks/bookmarks-categories.json');

    if (!response.ok) {
      throw new Error(`Failed to load bookmark categories: ${response.status} ${response.statusText}`);
    }

    const bookmarkCategories: BookmarkCategoryModel[] = await response.json();
    dispatchSetBookmarkCategories(bookmarkCategories);
  } catch (error) {
    console.error('Error loading bookmark categories:', { error });
    showNotification('loadBookmarkCategories', 'error', 'Failed to load bookmark categories', error);
  }
}

export async function loadBookmarks() {
  try {
    const response: CommonResponseModel<BookmarkModel[]> = await getBookmarksApi();

    if (response.success) {
      dispatchSetBookmarks(response.data);
      //  showNotification('loadBookmarks', 'success', 'Bookmarks loaded successfully');
    } else {
      showNotification('saveBookmark', 'error', 'Failed to load bookmark', response.message || 'Unknown error');
    }
  } catch (error) {
    console.log('Error loading bookmarks:', { error });
    showNotification('loadBookmarks', 'error', 'Failed to load bookmarks', error);
  }
}

export async function saveBookmark(bookmark: BookmarkModel) {
  try {
    const response: CommonResponseModel<BookmarkModel> = await upsertBookmarksApi(bookmark);

    if (response.success) {
      dispatchSetBookmark(response.data);
      showNotification('saveBookmark', 'success', 'Bookmark saved successfully');
    } else {
      showNotification('saveBookmark', 'error', 'Failed to save bookmark', response.message || 'Unknown error');
    }
  } catch (error) {
    console.log('Error setting bookmark:', { error });
    showNotification('saveBookmark', 'error', 'Failed to save bookmark', error);
  }
}

export async function deleteBookmark(bookmark: BookmarkModel) {
  console.log('Deleting bookmark:', bookmark);

  try {
    const response: CommonResponseModel<BookmarkModel> = await deleteBookmarksApi(bookmark);

    if (response.success) {
      dispatchRemoveBookmark(response.data.id);
      showNotification('deleteBookmark', 'success', 'Bookmark deleted successfully');
    } else {
      showNotification('deleteBookmark', 'error', 'Failed to delete bookmark', response.message || 'Unknown error');
    }
  } catch (error) {
    console.log('Error deleting bookmark:', { error });
    showNotification('deleteBookmark', 'error', 'Failed to delete bookmark', error);
  }
}
