import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';
import { useState, useCallback, useMemo } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import { InputAdornment, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';

import ExaminationList from './examination-list';
import ExaminationSearch from './examination-search';
import ExaminationFiltersResult from './examination-filters-result';
import { useGetExam } from 'src/api/examination';

// ----------------------------------------------------------------------

const defaultFilters = {
  roles: [],
  locations: [],
  benefits: [],
  experience: 'all',
  employmentTypes: [],
};

// ----------------------------------------------------------------------

export default function ExaminationListView({ currentStudent }) {
  const settings = useSettingsContext();

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');

  const [search, setSearch] = useState({
    query: '',
    results: [],
  });

  const { exam } = useGetExam(currentStudent?.company_id);

  const currentStudentExams = useMemo(() => {
    if (!exam) return [];

    return exam.flatMap((examItem) =>
      examItem.students
        .filter((student) => student.student_id._id === currentStudent._id)
        .map((student) => ({
          ...student,
          examTitle: examItem.title,
          totalMarks: examItem.total_marks,
          examDate: examItem.date,
          examId: examItem._id,
        }))
    );
  }, [exam, currentStudent._id]);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: currentStudentExams,
    filters,
    sortBy,
    searchQuery: search.query,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !dataFiltered.length && canReset;

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearch((prevState) => ({
      ...prevState,
      query: inputValue,
    }));
  }, []);

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <TextField
        fullWidth
        value={search.query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search exam title..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );

  const renderResults = (
    <ExaminationFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {notFound && <EmptyContent filled title="No Data" sx={{ py: 10 }} />}

      <ExaminationList currentStudentExams={dataFiltered} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy, searchQuery }) => {
  let data = [...inputData];

  if (searchQuery) {
    data = data.filter((item) => item.examTitle.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  if (sortBy === 'latest') {
    data = orderBy(data, ['examDate'], ['desc']);
  } else if (sortBy === 'oldest') {
    data = orderBy(data, ['examDate'], ['asc']);
  }

  return data;
};
