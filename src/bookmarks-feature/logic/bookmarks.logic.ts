import { CommonResponseModel } from '../../models/api/common-response.model';
import { BookmarkCategoryModel } from '../models/bookmark-category.model';
import { BookmarkModel } from '../models/bookmark.model';
import { deleteBookmarksApi, getBookmarksApi, upsertBookmarksApi } from '../proxy/bookmarks.proxy';
import { dispatchRemoveBookmark, dispatchSetBookmark, dispatchSetBookmarkCategories, dispatchSetBookmarks } from '../store/bookmarks.actions';
import { addSlice, store } from '../../infra/redux/store';
import bookmarksReducer from '../store/bookmarks.slice';
import { showNotification } from '../../infra/notifications/toast-notifier';
import { BookmarksRootState } from '../store/bookmarks.selectors';
import { centerMap } from '../../map-feature/logic/map.logic';
import React from 'react';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';
import { registerSidebarItem } from '../../layout-feature/logic/sidebar.logic';
import { BookmarksPanel } from '../components/bookmarks-panel.component';

export function initBookmarks() {
  addSlice('bookmarks', bookmarksReducer);

  loadBookmarkCategories();
  loadBookmarks();

  registerSidebarItem({
    id: 'bookmarks',
    icon: React.createElement(BookmarksOutlinedIcon),
    tooltip: 'Bookmarks',
    title: 'Bookmarks',
    component: BookmarksPanel,
    props: {
      title: 'Bookmarks',
    },
  });
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

export async function setHome(selectedBookmark: BookmarkModel): Promise<void> {
  try {
    const state = store.getState() as BookmarksRootState;
    const bookmarks = state.bookmarks?.bookmarks || [];

    // Find previous home bookmark if one exists
    const oldHome = bookmarks.find(
      (b) => b.kind?.toLowerCase() === 'home' && b.id !== selectedBookmark.id
    );

    // If an existing home bookmark is found, change it to location
    if (oldHome) {
      const updatedOldHome: BookmarkModel = {
        ...oldHome,
        kind: 'location',
      };
      const responseOld = await upsertBookmarksApi(updatedOldHome);
      if (responseOld.success) {
        dispatchSetBookmark(responseOld.data || updatedOldHome);
      } else {
        console.error('Failed to update old home bookmark to location:', responseOld.message);
      }
    }

    // Set the selected bookmark to home
    const updatedNewHome: BookmarkModel = {
      ...selectedBookmark,
      kind: 'home',
    };
    const responseNew = await upsertBookmarksApi(updatedNewHome);
    if (responseNew.success) {
      dispatchSetBookmark(responseNew.data || updatedNewHome);
      showNotification('setHome', 'success', `"${selectedBookmark.name}" set as Home location`);
    } else {
      showNotification('setHome', 'error', 'Failed to set home location', responseNew.message || 'Unknown error');
    }
  } catch (error) {
    console.error('Error in setHome:', { error });
    showNotification('setHome', 'error', 'Failed to set home location', error);
  }
}
export function centerBookmarkOnMap(bookmark: BookmarkModel): void {
  if (
    bookmark?.location &&
    typeof bookmark.location.longitude === 'number' &&
    typeof bookmark.location.latitude === 'number'
  ) {
    centerMap(bookmark.location.longitude, bookmark.location.latitude);
  }
}

export function openBookmarkDialogEvent(bookmark?: BookmarkModel): void {
  window.dispatchEvent(
    new CustomEvent('bookmarks:open-dialog', { detail: { bookmark } })
  );
}
