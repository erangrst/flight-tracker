import { initBookmarks } from "./bookmarks-feature/logic/bookmarks.logic";
import { MapViewComponent } from "./map-feature/components/map-view.component";
import { InformationComponent } from "./layout-feature/components/InformationComponent";
import { Toaster } from 'sonner';
import { Box } from '@mui/material';
import { useState } from "react";

export default function App() {

  initBookmarks();  // mobe to general logic Init()

  const [isExpanded, setIsExpanded] = useState(false);


  function handleExpandedToggle(expanded: boolean): void {
    setIsExpanded(expanded);
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        border: '2px solid green'
      }}
    >
      <Toaster position="top-right" richColors closeButton />
      <InformationComponent isExpanded={isExpanded} onExpandedToggle={handleExpandedToggle} expandedWidth={320} collapsedWidth={48} />
      < Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <MapViewComponent />
      </Box >
    </Box>
  );
}