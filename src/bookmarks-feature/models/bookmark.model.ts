import { LocationModel } from '../../components/map-feature/models/location.model';

export interface BookmarkModel {
  id?: string;
  kind: string;
  name: string;
  location: LocationModel;
}
