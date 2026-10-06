import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack, TextField, } from '@mui/material';
import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { BookmarkModel } from '../models/bookmark.model';

interface BookmarkDialogProps {
    open: boolean;
    bookmark?: BookmarkModel;
    onClose: () => void;
    onSave: (bookmark: BookmarkModel) => void;
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

const KIND_OPTIONS = [
    { value: 'location', label: 'Location' },
    { value: 'target', label: 'Target' },
    { value: 'favorite', label: 'Favorite' },
];

function bookmarkToBookMarkFormData(bookmark: BookmarkModel): BookmarkFormData {
    const formData: BookmarkFormData = bookmark
        ? {
            name: bookmark.name,
            kind: bookmark.kind,
            location: {
                latitude: bookmark.location.latitude,
                longitude: bookmark.location.longitude,
                altitude: bookmark.location.altitude,
            },
        }
        : DEFAULT_VALUES;

    return formData;
}

export const BookmarkDialogComponent: FC<BookmarkDialogProps> = ({ open, bookmark, onClose, onSave, }) => {
    const { control, handleSubmit, reset, formState: { errors } } = useForm<BookmarkFormData>({
        defaultValues: bookmarkToBookMarkFormData(bookmark)
    });

    const handleDialogClose = () => {
        reset(bookmarkToBookMarkFormData(bookmark));
        onClose();
    };

    const onSubmit = (data: BookmarkFormData) => {
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

        onSave(result);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>{bookmark ? 'Edit Bookmark' : 'Add Bookmark'}</DialogTitle>

            <DialogContent>
                <Stack
                    component="form"
                    id="bookmark-form"
                    onSubmit={handleSubmit(onSubmit)}
                    spacing={2}
                    sx={{ mt: 1 }}
                >
                    {/* Name */}
                    <Controller
                        name="name"
                        control={control}
                        rules={{
                            required: 'Name is required',
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Name"
                                fullWidth
                                required
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />

                    {/* Kind */}
                    <Controller
                        name="kind"
                        control={control}
                        rules={{ required: 'Kind is required' }}
                        render={({ field }) => (
                            <FormControl
                                fullWidth
                                required
                                error={!!errors.kind}
                            >
                                <InputLabel id="bookmark-kind-label">Kind</InputLabel>
                                <Select
                                    {...field}
                                    labelId="bookmark-kind-label"
                                    label="Kind"
                                >
                                    {KIND_OPTIONS.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
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

                    {/* Location */}
                    <Stack direction="row" spacing={2}>
                        {/* Latitude */}
                        <Controller
                            name="location.latitude"
                            control={control}
                            rules={{
                                required: 'Latitude is required',
                                validate: (value) => {
                                    if (value === '') { return 'Latitude is required'; }

                                    const latitude = Number(value);

                                    if (!Number.isFinite(latitude)) { return 'Latitude must be a number'; }
                                    if (latitude < -90 || latitude > 90) { return 'Latitude must be between -90 and 90'; }

                                    return true;
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        field.onChange(value === '' ? '' : Number(value),);
                                    }}
                                    label="Latitude"
                                    type="number"
                                    fullWidth
                                    required
                                    error={!!errors.location?.latitude}
                                    helperText={errors.location?.latitude?.message}
                                    slotProps={{ htmlInput: { step: 'any', }, }}
                                />
                            )}
                        />

                        {/* Longitude */}
                        <Controller
                            name="location.longitude"
                            control={control}
                            rules={{
                                required: 'Longitude is required',
                                validate: (value) => {
                                    if (value === '') { return 'Longitude is required'; }

                                    const longitude = Number(value);
                                    if (!Number.isFinite(longitude)) { return 'Longitude must be a number'; }
                                    if (longitude < -180 || longitude > 180) { return 'Longitude must be between -180 and 180'; }

                                    return true;
                                },
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        field.onChange(value === '' ? '' : Number(value),);
                                    }}
                                    label="Longitude"
                                    type="number"
                                    fullWidth
                                    required
                                    slotProps={{ htmlInput: { step: 'any', }, }} error={!!errors.location?.longitude}
                                    helperText={errors.location?.longitude?.message}
                                />
                            )}
                        />

                        {/* Altitude */}
                        <Controller
                            name="location.altitude"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={field.value}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        field.onChange(value === '' ? '' : Number(value),);
                                    }}
                                    label="Altitude"
                                    type="number"
                                    fullWidth
                                    slotProps={{ htmlInput: { step: 'any', }, }}
                                />
                            )}
                        />
                    </Stack>
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleDialogClose}>
                    Cancel
                </Button>

                <Button
                    type="submit"
                    form="bookmark-form"
                    variant="contained"
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};
