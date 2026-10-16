import { Layer, LogoControl, Map, MapLayerMouseEvent, MapProvider, MapRef, ScaleControl, Source, ViewStateChangeEvent } from '@vis.gl/react-maplibre';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { middleOfUSA } from '../../lib/constants';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ViewportBoundsModel } from '../models/viewport-bounds.model';
import { libertyMapStyle } from '../map-styles/build-in-styles';
import { MapToolbarComponent, PrimaryToolbarItem } from './toolbar/map-toolbar.component';
import { buildToolbarItems } from './toolbar/map-toolbar-configuration';
import { Box, Divider, Menu, MenuItem } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { CoordinatesControl } from './controls/coordinates-control.component';
import { precision } from '../models/definitions';
import { BookmarkDialog } from '../../bookmarks-feature/components/bookmark-dialog.component';
import { BookmarkModel, EmptyBookmark } from '../../bookmarks-feature/models/bookmark.model';
import { deleteBookmark, saveBookmark, setHome } from '../../bookmarks-feature/logic/bookmarks.logic';
import { poiLayerStyle } from '../layers-configuration';
import { useSelector } from 'react-redux';
import { bookmarkCategoriesSelector, BookmarksRootState, bookmarksSelector } from '../../bookmarks-feature/store/bookmarks.selectors';
import { BookmarkCategoryModel, EmptyBookmarkCategory } from '../../bookmarks-feature/models/bookmark-category.model';
import { EmptyLocation } from '../models/location.model';
import { CoordinateModel } from '../models/coordinate.model';

interface ContextMenuState {
    mouseX: number;
    mouseY: number;
    longitude: number;
    latitude: number;
    features?: maplibregl.MapGeoJSONFeature[];
    selectedBookmark?: BookmarkModel | null;
}

export const MapViewComponent: React.FC = () => {

    const bookmarks: BookmarkModel[] = useSelector(bookmarksSelector);
    const bookmarksCategories: BookmarkCategoryModel[] = useSelector(bookmarkCategoriesSelector);

    const mapRef = useRef<MapRef>(null);

    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

    const [showOverviewMap, setShowOverviewMap] = useState(false);
    const [showCoordinates, setShowCoordinates] = useState(true);
    const [mapLoaded, setMapLoaded] = useState(false);

    const [viewportBounds, setViewportBounds] = useState<ViewportBoundsModel>({ west: -180, south: -85, east: 180, north: 85, });

    const [toolbarItems, setToolbarItems] = useState<PrimaryToolbarItem[]>([]);

    const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState<boolean>(false);
    const [bookmarkDraft, setBookmarkDraft] = useState<BookmarkModel>();
    const [bookmarkCoordinatePreview, setBookmarkCoordinatePreview] = useState<CoordinateModel | null>(null);
    const [bookmarkDetailsPreview, setBookmarkDetailsPreview] = useState<{
        name: string;
        kind: string;
    } | null>(null);
    const [isPickingLocation, setIsPickingLocation] = useState<boolean>(false);

    const [isPoiVisible, setIsPoiVisible] = useState(true);

    useEffect(() => {
        if (!isPickingLocation) { return; }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                setIsPickingLocation(false);
                setBookmarkDialogOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPickingLocation]);

    useEffect(() => {
        const toolbarItems: PrimaryToolbarItem[] = buildToolbarItems(mapRef, setShowOverviewMap, setShowCoordinates);
        setToolbarItems(toolbarItems);
        console.log('Toolbar items built:', { toolbarItems });
    }, [mapRef]);


    async function addBookmarkCategoryImage(map: maplibregl.Map, bookmarkCategory: BookmarkCategoryModel) {
        try {
            const image = await map.loadImage(bookmarkCategory.icon);

            if (image && !map.hasImage(bookmarkCategory.value)) {
                map.addImage(bookmarkCategory.value, image.data);
            }
        } catch (error) {
            console.error('Failed to load map icon:', { bookmarkCategory, error });
        }
    }

    useEffect(() => {
        const map = mapRef.current?.getMap();
        if (!mapLoaded || !map) { return; }

        bookmarksCategories.forEach((category) => { addBookmarkCategoryImage(map, category); });
    }, [bookmarksCategories, mapLoaded]);

    const handleMove = useCallback(
        (event: ViewStateChangeEvent) => {
            const bounds = event.target.getBounds();

            setViewportBounds({
                west: bounds.getWest(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                north: bounds.getNorth(),
            });
        },
        [],
    );

    //#region Map Event Handlers

    const handleMapClick = (event: MapLayerMouseEvent) => {
        if (isPickingLocation) {
            pickLocation(event);
            return;
        }
    };

    //#endregion

    //#region Context Menu Handlers

    function pickLocation(event: MapLayerMouseEvent) {
        const lng = Number(event.lngLat.lng.toFixed(precision));
        const lat = Number(event.lngLat.lat.toFixed(precision));

        setIsPickingLocation(false);

        setBookmarkDraft((prevBookmark) => ({
            ...(prevBookmark || EmptyBookmark),
            kind: prevBookmark?.kind || 'location',
            location: {
                ...(prevBookmark?.location || EmptyLocation),
                longitude: lng,
                latitude: lat,
            },
        }));
        setBookmarkCoordinatePreview(null);

        setBookmarkDialogOpen(true);
    }

    const handleOpenContextMenu = (event: MapLayerMouseEvent) => {
        event.originalEvent.preventDefault();

        if (isPickingLocation) {
            return;
        }

        // Check if a symbol from the poi-layer was clicked
        let symbolFeature = event.features?.find((f) => f.layer.id === 'poi-layer');

        if (!symbolFeature && mapRef.current) {
            const bbox: [maplibregl.PointLike, maplibregl.PointLike] = [
                [event.point.x - 5, event.point.y - 5],
                [event.point.x + 5, event.point.y + 5],
            ];
            const queried = mapRef.current.queryRenderedFeatures(bbox, { layers: ['poi-layer'] });
            if (queried.length > 0) {
                symbolFeature = queried[0];
            }
        }

        let selectedBookmark: BookmarkModel | null = null;
        if (symbolFeature) {
            const bookmarkIndex = symbolFeature.properties?.bookmarkIndex;
            if (typeof bookmarkIndex === 'number' && bookmarks[bookmarkIndex]) {
                selectedBookmark = bookmarks[bookmarkIndex];
            } else {
                const propId = symbolFeature.properties?.id;
                const propTitle = symbolFeature.properties?.title;
                selectedBookmark = bookmarks.find((b) => (propId && b.id === propId) || (propTitle && b.name === propTitle)) ?? null;
            }
        }

        setContextMenu({
            mouseX: event.originalEvent.clientX,
            mouseY: event.originalEvent.clientY,
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
            features: event.features,
            selectedBookmark,
        });
    };

    function closeContextMenu() {
        setContextMenu(null);
    };

    //#endregion

    //#region Bookmarks CRUD Menu Handlers

    function handleAddBookmark(event?: React.MouseEvent) {
        event?.stopPropagation();

        const bookmarkDraft: BookmarkModel = {
            ...EmptyBookmark,
            location: {
                ...EmptyLocation,
                latitude: Number(contextMenu.latitude.toFixed(precision)),
                longitude: Number(contextMenu.longitude.toFixed(precision))
            }
        };

        closeContextMenu();
        openBookmarkDialog(bookmarkDraft);
    };

    function handleSetHome(event?: React.MouseEvent) {
        event?.stopPropagation();

        const bookmarkDraft = contextMenu && contextMenu.selectedBookmark || null;

        if (!bookmarkDraft) {
            console.error('No bookmark selected for set home.');
            return;
        }

        closeContextMenu();
        setHome(bookmarkDraft);
    };

    function handleUpdateBookmark(event?: React.MouseEvent) {
        event?.stopPropagation();

        const bookmarkDraft = contextMenu && contextMenu.selectedBookmark || null;

        if (!bookmarkDraft) {
            console.error('No bookmark selected for update.');
            return;
        }

        closeContextMenu();
        openBookmarkDialog(bookmarkDraft);
    };

    function handleDeleteBookmark(event?: React.MouseEvent) {
        event?.stopPropagation();

        const bookmarkDraft = contextMenu && contextMenu.selectedBookmark || null;

        if (!bookmarkDraft) {
            console.error('No bookmark selected for delete.');
            return;
        }

        closeContextMenu();
        deleteBookmark(bookmarkDraft);
    };

    //#endregion    

    function openBookmarkDialog(draftBookmark: BookmarkModel) {

        let tmpDraftBookmark: BookmarkModel;

        if (draftBookmark) {
            tmpDraftBookmark = { ...draftBookmark };
        }
        else {
            tmpDraftBookmark = {
                ...EmptyBookmark,
                location: {
                    ...EmptyLocation,
                    latitude: Number(contextMenu.latitude.toFixed(precision)),
                    longitude: Number(contextMenu.longitude.toFixed(precision))
                }
            };
        }

        setBookmarkDraft(tmpDraftBookmark);
        setBookmarkCoordinatePreview(null);
        setBookmarkDetailsPreview(null);
        setBookmarkDialogOpen(true);
    }

    //#region Copy Coordinates Menu Handler

    async function copyCoordinatesToClipboard() {
        if (!contextMenu) { return; }

        const coordinates = `${contextMenu.longitude.toFixed(precision)} / ${contextMenu.latitude.toFixed(precision)}`;

        try {
            await navigator.clipboard.writeText(coordinates);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('Failed to copy coordinates to clipboard:', { errorMessage });
        } finally {
            closeContextMenu();
        }
    }

    //#endregion

    const displayBookmarks: BookmarkModel[] = [...bookmarks];
    const bookmarkToDisplay: BookmarkModel | undefined = bookmarkDraft
        ? {
            ...bookmarkDraft,
            ...(bookmarkDetailsPreview || {}),
            location: {
                ...bookmarkDraft.location,
                latitude: bookmarkCoordinatePreview?.lat ?? bookmarkDraft.location.latitude,
                longitude: bookmarkCoordinatePreview?.lng ?? bookmarkDraft.location.longitude,
            },
        }
        : undefined;

    if (bookmarkToDisplay &&
        typeof bookmarkToDisplay.location?.longitude === 'number' &&
        typeof bookmarkToDisplay.location?.latitude === 'number' &&
        (bookmarkDialogOpen || isPickingLocation)
    ) {
        const existingIndex = bookmarkToDisplay.id ? displayBookmarks.findIndex((b) => b.id === bookmarkToDisplay.id) : -1;
        if (existingIndex !== -1) {
            displayBookmarks[existingIndex] = {
                ...displayBookmarks[existingIndex],
                ...bookmarkToDisplay,
            };
        } else {
            displayBookmarks.push({
                ...bookmarkToDisplay,
                id: bookmarkToDisplay.id || 'draft-bookmark',
                name: bookmarkToDisplay.name || 'New Bookmark',
                kind: bookmarkToDisplay.kind || 'location',
            });
        }
    }

    const geojsonData: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: displayBookmarks.map((bookmark, index) => ({
            type: 'Feature',
            id: bookmark.id || index,
            geometry: {
                type: 'Point',
                coordinates: [bookmark.location.longitude, bookmark.location.latitude],
            },
            properties: {
                id: bookmark.id,
                bookmarkIndex: index,
                title: bookmark.name,
                icon: bookmark.kind || 'location',
            },
        })),
    };

    //#endregion

    //#region Init Bookmarks Categories

    function handleMapLoad() {
        setMapLoaded(true);
    }

    //#endregion

    return (
        <MapProvider>
            <div
                style={{
                    border: '4px solid blue',
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    boxSizing: 'border-box',
                }}
            >
                {isPickingLocation && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 20,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 1200,
                            bgcolor: 'rgba(0, 0, 0, 0.85)',
                            color: '#fff',
                            px: 2.5,
                            py: 1,
                            borderRadius: 2,
                            boxShadow: 4,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            fontSize: '0.9rem',
                            pointerEvents: 'none',
                        }}
                    >
                        <LocationOn sx={{ color: '#4fc3f7' }} fontSize="small" />
                        <span>Left-click on the map to pin coordinate &bull; Press <strong>Esc</strong> to cancel</span>
                    </Box>
                )}

                <Map
                    ref={mapRef}
                    cursor={isPickingLocation ? 'crosshair' : undefined}
                    onLoad={handleMapLoad}
                    initialViewState={{
                        longitude: middleOfUSA[0],
                        latitude: middleOfUSA[1],
                        zoom: 2,
                        pitch: 0,
                        bearing: 0,
                    }}

                    onContextMenu={handleOpenContextMenu}
                    interactiveLayerIds={isPoiVisible ? ['poi-layer'] : []}

                    pitchWithRotate={false}
                    dragRotate={false}

                    // Zoom by mouse wheel
                    scrollZoom={true}

                    onMove={(event: ViewStateChangeEvent) => handleMove(event)}
                    onClick={(event: MapLayerMouseEvent) => handleMapClick(event)}

                    renderWorldCopies={false}
                    mapStyle={libertyMapStyle}

                    attributionControl={false}
                >
                    {/* <OverviewMapComponent bounds={viewportBounds} /> */}
                    <ScaleControl position='bottom-left' unit='metric' maxWidth={200} />
                    <LogoControl position='bottom-right' />
                    <MapToolbarComponent items={toolbarItems} />

                    {showCoordinates && <CoordinatesControl position='bottom-right' precision={precision} />}

                    <Source id="poi-source" type="geojson" data={geojsonData}>
                        <Layer {...(poiLayerStyle(isPoiVisible))} />
                    </Source>
                </Map >

                <Menu
                    open={contextMenu !== null}
                    onClose={closeContextMenu}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenu
                            ? {
                                top: contextMenu.mouseY,
                                left: contextMenu.mouseX,
                            }
                            : undefined
                    }
                >
                    <MenuItem onClick={copyCoordinatesToClipboard}>Copy coordinates</MenuItem>

                    <MenuItem onClick={(event) => {
                        handleAddBookmark(event);
                    }} >
                        Add Bookmark
                    </MenuItem>

                    {contextMenu?.selectedBookmark && (
                        <>
                            <Divider sx={{ height: '2px', mx: '4px', border: 0, bgcolor: 'primary.main' }} />
                            <MenuItem onClick={handleUpdateBookmark}>Update Bookmark</MenuItem>
                            <MenuItem onClick={handleDeleteBookmark}>Delete Bookmark</MenuItem>
                            {contextMenu.selectedBookmark.kind?.toLowerCase() !== 'home' && (
                                <>
                                    <Divider sx={{ height: '2px', mx: '4px', border: 0, bgcolor: 'primary.main' }} />
                                    <MenuItem onClick={handleSetHome}>Set Home Location</MenuItem>
                                </>
                            )}
                        </>
                    )}

                    <Divider sx={{ height: '2px', mx: '4px', border: 0, bgcolor: 'primary.main' }} />

                    <MenuItem onClick={closeContextMenu}>Close</MenuItem>
                </Menu>

                <BookmarkDialog
                    open={bookmarkDialogOpen}
                    bookmark={bookmarkDraft}
                    onClose={() => {
                        setBookmarkDialogOpen(false);
                        setBookmarkDraft(undefined);
                        setBookmarkCoordinatePreview(null);
                        setBookmarkDetailsPreview(null);
                    }}

                    onCoordinateChange={(coordinates) => {
                        const { lat, lng } = coordinates;

                        if (typeof lat === 'number' && Number.isFinite(lat) && typeof lng === 'number' && Number.isFinite(lng)) {
                            setBookmarkCoordinatePreview({ lat, lng });
                        } else {
                            setBookmarkCoordinatePreview(null);
                        }
                    }}
                    onDetailsChange={(details) => {
                        setBookmarkDetailsPreview(details);
                    }}
                    onPickLocation={(draft) => {
                        setBookmarkDraft(draft);
                        setBookmarkCoordinatePreview(null);
                        setBookmarkDetailsPreview(null);
                        setBookmarkDialogOpen(false);
                        setIsPickingLocation(true);
                    }}
                    onSave={(bookmark) => {
                        console.log('OnSave Saving bookmark:1', { bookmark });
                        saveBookmark(bookmark);
                        setBookmarkDialogOpen(false);
                        setBookmarkDraft(undefined);
                        setBookmarkCoordinatePreview(null);
                        setBookmarkDetailsPreview(null);
                    }}
                />
            </div>
        </MapProvider >
    );
}