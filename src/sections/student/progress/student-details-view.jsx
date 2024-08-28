import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { _orders } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import StudentProgressDetailsHistory from '../student-progrss-details-history';
import { useGetConfigs } from 'src/api/config';

// ----------------------------------------------------------------------

export default function StudentDetailsView({ currentStudent, mutate }) {
  const settings = useSettingsContext();
  const { configs } = useGetConfigs();

  const allCourse = [
    {
      course: 'Master In Full Stack Development',
      language: [
        { value: 'c', label: 'C Programming' },
        { value: 'c++', label: 'C++ programming' },
        { value: 'html', label: 'HTML' },
        { value: 'css', label: 'CSS' },
        { value: 'bootstrap', label: 'Bootstrap' },
        { value: 'javascript', label: 'JavaScript' },
        { value: 'react', label: 'React' },
        { value: 'mysql', label: 'MySQL' },
        { value: 'mongodb', label: 'MongoDB' },
        { value: 'nodejs', label: 'NodeJS' },
      ],
    },
    {
      course: 'Master In Flutter Development',
      language: [
        { value: 'c', label: 'C' },
        { value: 'c++', label: 'C++' },
        { value: 'dart', label: 'Dart' },
        { value: 'flutter', label: 'Flutter' },
      ],
    },
    {
      course: 'Adobe XD',
      language: [{ value: 'adobexd', label: 'Adobe XD' }],
    },
    {
      course: 'Adobe Illustrator',
      language: [{ value: 'adobeillustrator', label: 'Adobe Illustrator' }],
    },
    {
      course: 'Node js',
      language: [{ value: 'nodejs', label: 'Node js' }],
    },
    {
      course: 'React js',
      language: [{ value: 'reactjs', label: 'React js' }],
    },
    {
      course: 'Python',
      language: [{ value: 'python', label: 'Python' }],
    },
    {
      course: 'Angular JS',
      language: [{ value: 'angularjs', label: 'Angular JS' }],
    },
    {
      course: 'C Programming',
      language: [{ value: 'cprogramming', label: 'C Programming' }],
    },
    {
      course: 'C++ Programming',
      language: [{ value: 'c++programming', label: 'C++ Programming' }],
    },
    {
      course: 'Java Programming',
      language: [{ value: 'javaprogramming', label: 'Java Programming' }],
    },
    {
      course: 'IOS',
      language: [{ value: 'ios', label: 'IOS' }],
    },
    {
      course: 'Advance PHP',
      language: [{ value: 'advancephp', label: 'Advance PHP' }],
    },
    {
      course: 'Laravel',
      language: [{ value: 'laravel', label: 'Laravel' }],
    },
    {
      course: 'Wordpress',
      language: [{ value: 'wordpress', label: 'Wordpress' }],
    },
    {
      course: 'Master in UI/UX Design',
      language: [
        { value: 'adobeillustrator', label: 'Adobe illustrator' },
        { value: 'adobephotoshop', label: 'Adobe phtoshope' },
        { value: 'adobexd', label: 'Adobe xd' },
        { value: 'figma', label: 'Figma' },
        { value: 'canva', label: 'Canva' },
      ],
    },
    {
      course: 'Master In Web Design',
      language: [
        { value: 'adobeillustrator', label: 'Adobe illustrator' },
        { value: 'adobephotoshop', label: 'Adobe phtoshope' },
        { value: 'adobexd', label: 'Adobe xd' },
        { value: 'figma', label: 'Figma' },
        { value: 'canva', label: 'Canva' },
      ],
    },
    {
      course: 'Advance Graphics Design',
      language: [
        { value: 'adobeillustrator', label: 'Adobe illustrator' },
        { value: 'adobephotoshop', label: 'Adobe phtoshope' },
        { value: 'adobexd', label: 'Adobe xd' },
        { value: 'figma', label: 'Figma' },
        { value: 'canva', label: 'Canva' },
      ],
    },
    {
      course: 'Photoshop',
      language: [{ value: 'photoshop', label: 'Photoshop' }],
    },
    {
      course: 'CCC- Basic Computer Course',
      language: [
        { value: 'msoffice', label: 'Ms office' },
        { value: 'powerpoint', label: 'Power point' },
        { value: 'excel', label: 'Excel' },
      ],
    },
    {
      course: 'Digital Marketing',
      language: [
        { value: 'onpageseo', label: 'On page seo' },
        { value: 'offpageseo', label: 'Off page seo' },
      ],
    },
    {
      course: 'HTML',
      language: [{ value: 'html', label: 'HTML' }],
    },
    {
      course: 'CSS',
      language: [{ value: 'css', label: 'CSS' }],
    },
    {
      course: 'Backend Development',
      language: [
        { value: 'mongodb', label: 'MongoDB' },
        { value: 'mysql', label: 'MySQL' },
        { value: 'node js', label: 'Node Js' },
      ],
    },
    {
      course: 'Frontend Development',
      language: [
        { value: 'c', label: 'C Programming' },
        { value: 'c++', label: 'C++ programming' },
        { value: 'html', label: 'HTML' },
        { value: 'css', label: 'CSS' },
        { value: 'bootstrap', label: 'Bootstrap' },
        { value: 'javascript', label: 'JavaScript' },
        { value: 'react', label: 'React' },
      ],
    },
  ];

  const courseDetails = configs?.courses?.find(
    (e) => e?.name.toLowerCase() === currentStudent?.course.toLowerCase()
  );
  const language = courseDetails ? courseDetails?.subcategories : [];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
            <StudentProgressDetailsHistory
              language={language}
              currentStudent={currentStudent}
              mutate={mutate}
            />
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

StudentDetailsView.propTypes = {
  currentStudent: PropTypes.shape({
    course: PropTypes.string.isRequired,
  }).isRequired,
  mutate: PropTypes.func.isRequired,
};
