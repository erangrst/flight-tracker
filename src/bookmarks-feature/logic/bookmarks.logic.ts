import { CommonResponseModel } from '../../models/api/common-response.model';
import { BookmarkModel } from '../models/bookmark.model';
import { deleteBookmarksApi, getBookmarksApi, upsertBookmarksApi } from '../proxy/bookmarks.proxy';
import { setBookmark, setBookmarks } from '../store/bookmarks.actions';
import { addSlice } from '../../infra/redux/store';
import bookmarksReducer from '../store/bookmarks.slice';
import { showNotification } from '../../infra/notifications/toast-notifier';

export function initBookmarks() {
  addSlice('bookmarks', bookmarksReducer);
}

export async function loadBookmarks() {
  try {
    const response: CommonResponseModel<BookmarkModel[]> = await getBookmarksApi();
    setBookmarks(response.data || []);
  } catch (error) {
    console.log('Error loading bookmarks:', { error });
    showNotification('loadBookmarks', 'error', 'Failed to load bookmarks', error);
  }
}

export async function saveBookmark(bookmark: BookmarkModel) {
  console.log('Saving bookmark:', bookmark);

  try {
    const response: CommonResponseModel<BookmarkModel> = await upsertBookmarksApi(bookmark);

    if (response.success) {
      setBookmark(response.data);
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
      deleteBookmark(response.data);
      showNotification('deleteBookmark', 'success', 'Bookmark deleted successfully');
    } else {
      showNotification('deleteBookmark', 'error', 'Failed to delete bookmark', response.message || 'Unknown error');
    }
  } catch (error) {
    console.log('Error deleting bookmark:', { error });
    showNotification('deleteBookmark', 'error', 'Failed to delete bookmark', error);
  }
}
