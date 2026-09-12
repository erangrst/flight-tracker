import { AxiosResponse } from 'axios';
import { proxyClient } from '../../infra/proxy/proxy-client';
import { CommonResponseModel } from '../../models/api/common-response.model';
import { BookmarkModel } from '../models/bookmark.model';

export async function getBookmarksApi(): Promise<CommonResponseModel<BookmarkModel[]>> {
  try {
    const response: AxiosResponse<CommonResponseModel<BookmarkModel[]>> = await proxyClient.get('/Bookmarks/GetBookmarks');

    return response.data;
  } catch (error) {
    console.error('Error at getBookmarksApi:', { error });
    throw error;
  }
}

export async function upsertBookmarksApi(bookmark: BookmarkModel): Promise<CommonResponseModel<BookmarkModel>> {
  try {
    const response: AxiosResponse<CommonResponseModel<BookmarkModel>> = await proxyClient.post('/Bookmarks/upsertBookmark', { data: bookmark });

    return response.data;
  } catch (error) {
    console.error('Error at upsertBookmarksApi:', { error });
    throw error;
  }
}

export async function deleteBookmarksApi(bookmark: BookmarkModel): Promise<CommonResponseModel<BookmarkModel>> {
  try {
    const response: AxiosResponse<CommonResponseModel<BookmarkModel>> = await proxyClient.delete(`/Bookmarks/deleteBookmark?id=${bookmark.id}`);

    return response.data;
  } catch (error) {
    console.error('Error at upsertBookmarksApi:', { error });
    throw error;
  }
}
