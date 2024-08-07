import React from 'react';
import { Autocomplete, Checkbox, Chip, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const RHFAutocomplete1 = ({ name, control, studentName, labelName }) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <Autocomplete
        {...field}
        multiple
        options={studentName}
        getOptionLabel={(option) => option?.firstName}
        value={field.value || []}
        isOptionEqualToValue={(option, value) => option._id === value._id}
        onChange={(event, newValue) => field.onChange(newValue)}
        disableCloseOnSelect
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox style={{ marginRight: 8 }} checked={selected} />
            {`${option?.firstName} ${option?.lastName}`}
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option?._id}
              label={`${option?.firstName} ${option?.lastName}`}
              size="small"
              color="info"
              variant="soft"
            />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label={labelName} placeholder={labelName} />
        )}
      />
    )}
  />
);

export default RHFAutocomplete1;
