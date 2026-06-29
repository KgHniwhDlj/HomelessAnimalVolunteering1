import { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export default function BasicSelect({
  options = [],
  label = '',
  value = '',
  onChange,
}) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl sx={{ minWidth: 250, marginTop: 1 }}>
        <InputLabel id={label}>{label}</InputLabel>
        <Select
          labelId={label}
          id={label}
          value={value}
          label={label}
          onChange={onChange}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}