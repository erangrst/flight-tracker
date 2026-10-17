import { initBookmarks } from "./bookmarks-feature/logic/bookmarks.logic";
import { MapViewComponent } from "./map-feature/components/map-view.component";
import { InformationComponent } from "./layout-feature/components/InformationComponent";
import { Toaster } from 'sonner';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { useState } from "react";
import type { PaletteMode } from '@mui/material';
import { ThemeSelectorComponent } from './themes-feature/components/ThemeSelectorComponent';
import { darkTheme, lightTheme } from './themes-feature/themes-configuration';

export default function App() {

  initBookmarks();  // mobe to general logic Init()

  const [isExpanded, setIsExpanded] = useState(false);
  const [themeMode, setThemeMode] = useState<PaletteMode>('light');


  function handleExpandedToggle(expanded: boolean): void {
    setIsExpanded(expanded);
  }

  return (
    <ThemeProvider theme={themeMode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
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
        <Box component="main"
          sx={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}        >
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1100 }}>
            <ThemeSelectorComponent mode={themeMode} onModeChange={setThemeMode} />
          </Box>
          <MapViewComponent />
        </Box>
      </Box>
    </ThemeProvider>
  );
}