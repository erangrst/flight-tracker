import { EmptyLocation, LocationModel } from '../../map-feature/models/location.model';

export interface BookmarkModel {
  id?: string;
  kind: string;
  name: string;
  location: LocationModel;
}

export const EmptyBookmark: BookmarkModel = {
  id: '',
  kind: '',
  name: '',
  location: { ...EmptyLocation },
};
