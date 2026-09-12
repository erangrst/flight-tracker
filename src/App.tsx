import { initBookmarks } from "./bookmarks-feature/logic/bookmarks.logic";
import { MapViewComponent } from "./components/map-feature/components/map-view.component";
import { Toaster } from 'sonner';

export default function App() {

  initBookmarks();


  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <MapViewComponent />
    </>
  );
}