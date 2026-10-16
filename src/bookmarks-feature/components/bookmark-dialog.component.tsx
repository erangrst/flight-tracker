import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { BookmarkModel } from '../models/bookmark.model';
import { useSelector } from 'react-redux';
import { bookmarkCategoriesSelector, BookmarksRootState, bookmarksSelector } from '../store/bookmarks.selectors';
import { BookmarkCategoryModel } from '../models/bookmark-category.model';
import { CoordinateModel } from '../../map-feature/models/coordinate.model';

interface BookmarkDialogProps {
    open: boolean;
    bookmark?: BookmarkModel;
    onClose: () => void;
    onSave: (bookmark: BookmarkModel) => void;
    onPickLocation: (draftBookmark: BookmarkModel) => void;
    // onCoordinateChange: (coordinates: {
    //     latitude: number | '';
    //     longitude: number | '';
    // }) => void;

    onCoordinateChange: (coordinates: CoordinateModel) => void;

    onDetailsChange: (details: { name: string; kind: string }) => void;
}

interface BookmarkFormData {
    name: string;
    kind: string;
    location: {
        latitude: number | '';
        longitude: number | '';
        altitude: number | '';
    };
}

const DEFAULT_VALUES: BookmarkFormData = {
    name: '',
    kind: '',
    location: {
        latitude: '',
        longitude: '',
        altitude: '',
    },
};

export const BookmarkDialog: FC<BookmarkDialogProps> = ({ open, bookmark, onClose, onSave, onPickLocation, onCoordinateChange, onDetailsChange }) => {

    const bookmarks: BookmarkModel[] = useSelector(bookmarksSelector);
    const bookmarksCategories: BookmarkCategoryModel[] = useSelector(bookmarkCategoriesSelector);

    useEffect(() => {
        console.log('%bookmarksCategories updated', 'background: yellow; color: black;', { bookmarksCategories });
    }, [bookmarksCategories]);

    const { control, handleSubmit, reset, trigger, getValues, formState: { errors }, } = useForm<BookmarkFormData>({
        defaultValues: DEFAULT_VALUES,
    });

    const handlePickLocationClick = () => {
        const currentValues = getValues();
        const draftBookmark: BookmarkModel = {
            id: bookmark?.id,
            name: currentValues.name,
            kind: currentValues.kind,
            location: {
                latitude: currentValues.location.latitude === '' ? ('' as any) : Number(currentValues.location.latitude),
                longitude: currentValues.location.longitude === '' ? ('' as any) : Number(currentValues.location.longitude),
                altitude: currentValues.location.altitude === '' ? ('' as any) : Number(currentValues.location.altitude),
            },
        };
        onPickLocation?.(draftBookmark);
    };

    const handleCoordinateChange = () => {
        const location = getValues('location');
        // onCoordinateChange?.({
        //     latitude: location.latitude,
        //     longitude: location.longitude,
        // });
        onCoordinateChange?.({
            lat: location.latitude,
            lng: location.longitude,
        });
    };

    /*
     * Initialize the form when the dialog is opened or when the bookmark being
     * edited changes.
     */
    useEffect(() => {
        if (!open) {
            return;
        }

        if (bookmark) {
            reset({
                name: bookmark.name,
                kind: bookmark.kind,
                location: {
                    latitude: bookmark.location.latitude,
                    longitude: bookmark.location.longitude,
                    altitude: bookmark.location.altitude,
                },
            });
        } else {
            reset(DEFAULT_VALUES);
        }
    }, [open, bookmark, reset]);

    const onSubmit = (data: BookmarkFormData) => {
        if (data.kind?.toLowerCase() === 'home') {
            const homeExists = (bookmarks || []).some(
                (b) => b.kind?.toLowerCase() === 'home' && (!bookmark?.id || b.id !== bookmark.id)
            );

            if (homeExists) { return; }
        }

        const result: BookmarkModel = {
            id: bookmark?.id,
            name: data.name,
            kind: data.kind,
            location: {
                latitude: Number(data.location.latitude),
                longitude: Number(data.location.longitude),
                altitude: Number(data.location.altitude),
            },
        };

        // alert('OnSave dlg');
        onSave(result);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {bookmark ? 'Edit Bookmark' : 'Add Bookmark'}
            </DialogTitle>

            <DialogContent>
                <Stack
                    component="form"
                    id="bookmark-form"
                    onSubmit={handleSubmit(onSubmit)}
                    spacing={2}
                    sx={{ mt: 1 }}
                >
                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: 'Name is required',
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                onChange={(event) => {
                                    field.onChange(event);
                                    onDetailsChange({
                                        name: event.target.value,
                                        kind: getValues('kind'),
                                    });
                                }}
                                label="Name"
                                fullWidth
                                required
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        name="kind"
                        control={control}
                        rules={{
                            required: 'Kind is required',
                            validate: (value) => {
                                if (value?.toLowerCase() === 'home') {
                                    const homeExists = (bookmarks || []).some(
                                        (b) => b.kind?.toLowerCase() === 'home' && (!bookmark?.id || b.id !== bookmark.id)
                                    );
                                    if (homeExists) {
                                        return 'Only one Home bookmark can exist';
                                    }
                                }
                                return true;
                            },
                        }}
                        render={({ field }) => (
                            <FormControl
                                fullWidth
                                required
                                error={!!errors.kind}
                            >
                                <InputLabel id="bookmark-kind-label">
                                    Kind
                                </InputLabel>

                                <Select
                                    {...field}
                                    onChange={(event) => {
                                        field.onChange(event);
                                        trigger('kind');
                                        onDetailsChange({
                                            name: getValues('name'),
                                            kind: event.target.value,
                                        });
                                    }}
                                    labelId="bookmark-kind-label"
                                    label="Kind"
                                >
                                    {bookmarksCategories.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>

                                {errors.kind && (
                                    <FormHelperText>
                                        {errors.kind.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        )}
                    />
                    <Stack direction="row" sx={{ alignItems: 'center' }}>
                        <Controller
                            name="location.latitude"
                            control={control}
                            rules={{
                                required: 'Latitude is required',
                                validate: (value) => {
                                    if (value === '') {
                                        return 'Latitude is required';
                                    }

                                    const latitude = Number(value);

                                    if (!Number.isFinite(latitude)) {
                                        return 'Latitude must be a number';
                                    }

                                    if (latitude < -90 || latitude > 90) {
                                        return 'Latitude must be between -90 and 90';
                                    }

                                    return true;
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        field.onChange(
                                            value === '' ? '' : Number(value),
                                        );
                                        handleCoordinateChange();
                                    }}
                                    label="Latitude"
                                    type="number"
                                    fullWidth
                                    required
                                    sx={{ marginRight: '1rem' }}
                                    error={!!errors.location?.latitude}
                                    helperText={errors.location?.latitude?.message}
                                    slotProps={{
                                        htmlInput: {
                                            step: 'any',
                                        },
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="location.longitude"
                            control={control}
                            rules={{
                                required: 'Longitude is required',
                                validate: (value) => {
                                    if (value === '') {
                                        return 'Longitude is required';
                                    }

                                    const longitude = Number(value);

                                    if (!Number.isFinite(longitude)) {
                                        return 'Longitude must be a number';
                                    }

                                    if (longitude < -180 || longitude > 180) {
                                        return 'Longitude must be between -180 and 180';
                                    }

                                    return true;
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        field.onChange(
                                            value === '' ? '' : Number(value),
                                        );
                                        handleCoordinateChange();
                                    }}
                                    label="Longitude"
                                    type="number"
                                    fullWidth
                                    required
                                    sx={{ marginRight: '1rem' }}
                                    error={!!errors.location?.longitude}
                                    helperText={errors.location?.longitude?.message}
                                    slotProps={{
                                        htmlInput: {
                                            step: 'any',
                                        },
                                    }}
                                />
                            )}
                        />

                        <Tooltip title="Pin coordinate on map (Right-click)" arrow>
                            <IconButton
                                color="primary"
                                onClick={handlePickLocationClick}
                                aria-label="Pin coordinate on map"
                                sx={{ marginRight: '3rem', padding: 0 }}
                            >
                                <LocationOnIcon />
                            </IconButton>
                        </Tooltip>

                        <Controller
                            name="location.altitude"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        field.onChange(
                                            value === '' ? '' : Number(value),
                                        );
                                    }}
                                    label="Altitude"
                                    type="number"
                                    fullWidth
                                    slotProps={{
                                        htmlInput: {
                                            step: 'any',
                                        },
                                    }}
                                />
                            )}
                        />
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    type="submit"
                    form="bookmark-form"
                    variant="contained"
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
