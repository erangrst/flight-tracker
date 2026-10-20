import React, { FC, useMemo, useState } from 'react';
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PlaceIcon from '@mui/icons-material/Place';
import { useSelector } from 'react-redux';
import { Grid, ICellProps, IColumnConfig, IApi } from '@svar-ui/react-grid';
import '@svar-ui/react-grid/all.css';

import { BookmarkModel } from '../models/bookmark.model';
import { BookmarkCategoryModel } from '../models/bookmark-category.model';
import {
  bookmarkCategoriesSelector,
  bookmarksSelector,
  selectedBookmarkIdSelector,
} from '../store/bookmarks.selectors';
import { dispatchSetSelectedBookmark } from '../store/bookmarks.actions';
import {
  centerBookmarkOnMap,
  deleteBookmark,
  openBookmarkDialogEvent,
  setHome,
} from '../logic/bookmarks.logic';

export interface BookmarksPanelProps {
  title?: string;
  onAddBookmark?: () => void;
  onUpdateBookmark?: (bookmark: BookmarkModel) => void;
  onGotoBookmark?: (bookmark: BookmarkModel) => void;
  onSetHomeBookmark?: (bookmark: BookmarkModel) => void;
  onDeleteBookmark?: (bookmark: BookmarkModel) => void;
}

export const BookmarksPanel: FC<BookmarksPanelProps> = ({
  title = 'Bookmarks',
  onAddBookmark,
  onUpdateBookmark,
  onGotoBookmark,
  onSetHomeBookmark,
  onDeleteBookmark,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const bookmarks: BookmarkModel[] = useSelector(bookmarksSelector);
  const bookmarkCategories: BookmarkCategoryModel[] = useSelector(bookmarkCategoriesSelector);
  const selectedBookmarkId: string = useSelector(selectedBookmarkIdSelector);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeBookmark, setActiveBookmark] = useState<BookmarkModel | null>(null);

  // Fast category lookup by lowercase value
  const categoryMap = useMemo(() => {
    const map = new Map<string, BookmarkCategoryModel>();
    bookmarkCategories.forEach((cat) => {
      map.set(cat.value?.toLowerCase(), cat);
    });
    return map;
  }, [bookmarkCategories]);

  // Ensure every row has a stable unique string ID for SVAR Grid
  const gridData = useMemo(() => {
    return bookmarks.map((b, index) => ({
      ...b,
      id: b.id || `bookmark-${index}`,
    }));
  }, [bookmarks]);

  // Handlers for Add Button
  const handleAddClick = () => {
    if (onAddBookmark) {
      onAddBookmark();
    } else {
      openBookmarkDialogEvent();
    }
  };

  // Menu Open/Close handlers
  const handleOpenMenu = (element: HTMLElement, bookmark: BookmarkModel) => {
    setActiveBookmark(bookmark);
    setMenuAnchorEl(element);
    if (bookmark.id) {
      dispatchSetSelectedBookmark(bookmark.id);
    }
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setActiveBookmark(null);
  };

  // Menu action triggers
  const handleUpdateClick = () => {
    if (!activeBookmark) return;
    const bookmarkToUpdate = { ...activeBookmark };
    handleCloseMenu();

    if (onUpdateBookmark) {
      onUpdateBookmark(bookmarkToUpdate);
    } else {
      openBookmarkDialogEvent(bookmarkToUpdate);
    }
  };

  const handleGotoClick = () => {
    if (!activeBookmark) return;
    const targetBookmark = { ...activeBookmark };
    handleCloseMenu();

    if (onGotoBookmark) {
      onGotoBookmark(targetBookmark);
    } else {
      centerBookmarkOnMap(targetBookmark);
    }
  };

  const handleSetHomeClick = () => {
    if (!activeBookmark) return;
    const targetBookmark = { ...activeBookmark };
    handleCloseMenu();

    if (onSetHomeBookmark) {
      onSetHomeBookmark(targetBookmark);
    } else {
      setHome(targetBookmark);
    }
  };

  const handleDeleteClick = () => {
    if (!activeBookmark) return;
    const targetBookmark = { ...activeBookmark };
    handleCloseMenu();

    if (onDeleteBookmark) {
      onDeleteBookmark(targetBookmark);
    } else {
      deleteBookmark(targetBookmark);
    }
  };

  // Selection handler
  const handleSelectRow = (event?: { id?: any }) => {
    if (event?.id !== undefined && event?.id !== null) {
      dispatchSetSelectedBookmark(String(event.id));
    }
  };

  const handleGridInit = (api: IApi) => {
    api.on('select-row', (ev: { id?: any }) => {
      if (ev?.id !== undefined && ev?.id !== null) {
        dispatchSetSelectedBookmark(String(ev.id));
      }
    });
  };

  // Grid column configurations
  const columns: IColumnConfig[] = useMemo(() => {
    return [
      {
        id: 'name',
        header: 'Name',
        flexgrow: 1,
        width: 140,
        cell: ({ row }: ICellProps) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              overflow: 'hidden',
              px: 0.5,
            }}
          >
            <Typography
              variant="body2"
              noWrap
              title={row.name}
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'text.primary',
              }}
            >
              {row.name}
            </Typography>
          </Box>
        ),
      },
      {
        id: 'kind',
        header: 'Kind',
        width: 60,
        cell: ({ row }: ICellProps) => {
          const category = categoryMap.get(String(row.kind || '').toLowerCase());
          const categoryLabel = category?.label || row.kind || 'Bookmark';
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Tooltip title={categoryLabel} arrow placement="top">
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {category?.icon ? (
                    <img
                      src={category.icon}
                      alt={categoryLabel}
                      style={{
                        width: 22,
                        height: 22,
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <PlaceIcon sx={{ fontSize: 22, color: 'text.secondary' }} />
                  )}
                </Box>
              </Tooltip>
            </Box>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        width: 48,
        cell: ({ row }: ICellProps) => {
          return (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenMenu(e.currentTarget, row as unknown as BookmarkModel);
                }}
                sx={{
                  p: 0.5,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                  },
                }}
                aria-label="Bookmark actions"
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        },
      },
    ];
  }, [categoryMap]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        bgcolor: 'background.paper',
      }}
    >
      {/* Top Toolbar Area */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {title}
        </Typography>

        <Tooltip title="Add Bookmark" arrow placement="bottom">
          <IconButton
            color="primary"
            size="small"
            onClick={handleAddClick}
            aria-label="Add Bookmark"
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Grid Container - Occupies the entire remaining height with scrollbar when exceeded */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          '--wx-background': theme.palette.background.paper,
          '--wx-color-font': theme.palette.text.primary,
          '--wx-table-header-background': isDark ? '#1e2936' : '#f5f7fa',
          '--wx-table-border': `1px solid ${theme.palette.divider}`,
          '--wx-table-cell-border': `1px solid ${theme.palette.divider}`,
          '--wx-table-header-cell-border': `1px solid ${theme.palette.divider}`,
          '--wx-table-select-background': isDark ? 'rgba(144, 202, 249, 0.16)' : 'rgba(25, 118, 210, 0.08)',
          '--wx-table-select-color': theme.palette.text.primary,
        }}
      >
        <Grid
          data={gridData}
          columns={columns}
          select={true}
          multiselect={false}
          selectedRows={selectedBookmarkId ? [selectedBookmarkId] : []}
          onSelectRow={handleSelectRow}
          init={handleGridInit}
        />
      </Box>

      {/* Row Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl && activeBookmark)}
        onClose={handleCloseMenu}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              minWidth: 160,
              borderRadius: 1.5,
              py: 0.5,
            },
          },
        }}
      >
        {/* 1. Update icon + Update title */}
        <MenuItem onClick={handleUpdateClick} dense>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Update" />
        </MenuItem>

        {/* 2. Goto title (icons and text vertically aligned together) */}
        <MenuItem onClick={handleGotoClick} dense>
          <ListItemIcon sx={{ minWidth: 32 }} />
          <ListItemText primary="Goto" />
        </MenuItem>

        {/* 3. Divider before Set Home (only if not Home) */}
        {activeBookmark?.kind?.toLowerCase() !== 'home' && (
          <Divider sx={{ my: 0.5 }} />
        )}

        {/* 4. Home icon + Set Home title (only if not Home) */}
        {activeBookmark?.kind?.toLowerCase() !== 'home' && (
          <MenuItem onClick={handleSetHomeClick} dense>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <HomeOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Set Home" />
          </MenuItem>
        )}

        {/* 5. Divider before Delete */}
        <Divider sx={{ my: 0.5 }} />

        {/* 6. Delete icon + Delete title */}
        <MenuItem onClick={handleDeleteClick} dense sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <DeleteOutlinedIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Delete" sx={{ color: 'error.main' }} />
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Aliases to match requested naming
export const BookmarkPanel = BookmarksPanel;
export const BoommarlPanel = BookmarksPanel;
export default BookmarksPanel;

