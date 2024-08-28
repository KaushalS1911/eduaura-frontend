import c from 'src/assets/all-language/c.png';
import cplus from 'src/assets/all-language/c++.png';
import html from 'src/assets/all-language/html.png';
import css from 'src/assets/all-language/css.png';
import javascript from 'src/assets/all-language/JavaScript.png';
import dart from 'src/assets/all-language/Dart.png';
import figma from 'src/assets/all-language/Figma.webp';
import firebase from 'src/assets/all-language/Firebase.png';
import flutter from 'src/assets/all-language/Flutter.png';
import jquery from 'src/assets/all-language/jquery.png';
import php from 'src/assets/all-language/PHP.png';
import python from 'src/assets/all-language/Python.png';
import photoshop from 'src/assets/all-language/Photoshop.png';
import mobgodb from 'src/assets/all-language/MongoDB.png';
import mysql from 'src/assets/all-language/MySQl.png';
import xd from 'src/assets/all-language/XD.png';
import react from 'src/assets/all-language/React js.png';
import node from 'src/assets/all-language/Node js.png';
import java from 'src/assets/all-language/Java.png';
import illustrator from 'src/assets/all-language/Illustrator.png';

export const INQUIRY_REFERENCE_BY = [
  { value: 'Google', label: 'Google' },
  { value: 'Just Dial', label: 'Just Dial' },
  { value: 'Social Media', label: 'Social Media' },
  { value: 'Board Banner', label: 'Board Banner' },
  { value: 'Brochure', label: 'Brochure' },
  { value: 'Other', label: 'Other' },
];

export const INQUIRY_SUGGESTED_IN = [
  { value: 'Self Instrested', label: 'Self Instrested' },
  { value: 'Suggested by someone', label: 'Suggested by someone' },
];

export const INQUIRY_INTERESTED_IN = [
  { value: 'Web Designing', label: 'Web Designing' },
  { value: 'Web Development', label: 'Web Development' },
  { value: 'ios Development', label: 'ios Development' },
  { value: 'Full-stack Development', label: 'Full-stack Development' },
  { value: 'Android App', label: 'Android App' },
  { value: 'Game Development', label: 'Game Development' },
  { value: 'Flutter Delelopment', label: 'Flutter Delelopment' },
  { value: 'React Native', label: 'React Native' },
  { value: 'UI/UX Design', label: 'UI/UX Design' },
  { value: 'Other', label: 'Other' },
];

export const DEMO_FACULTY = ['Kaushal Sir', 'Dixita Mam', 'Nisha Mam', 'Rutvik Sir'];

export const programmingLanguages = [
  {
    label: 'C Language',
    image: c,
  },
  {
    label: 'C++ Language',
    image: 'cplus',
  },
  {
    label: 'HTML',
    image: html,
  },
  {
    label: 'CSS',
    image: css,
  },
  {
    label: 'JavaScript',
    image: javascript,
  },
  {
    label: 'JQuery',
    image: jquery,
  },
  {
    label: 'React js',
    image: react,
  },
  {
    label: 'Node js',
    image: node,
  },
  {
    label: 'MongoDB',
    image: mobgodb,
  },
  {
    label: 'MySQl',
    image: mysql,
  },
  {
    label: 'Firebase',
    image: firebase,
  },
  {
    label: 'Python',
    image: python,
  },
  {
    label: 'Java',
    image: java,
  },
  {
    label: 'PHP',
    image: php,
  },
  {
    label: 'Dart',
    image: dart,
  },
  {
    label: 'Flutter',
    image: flutter,
  },
  {
    label: 'Photoshop',
    image: photoshop,
  },
  {
    label: 'Illustrator',
    image: illustrator,
  },
  {
    label: 'Figma',
    image: figma,
  },
  {
    label: 'Adobe XD',
    image: xd,
  },
];

export function ExamImage(data) {
  return programmingLanguages.find((item) => {
    if (item.label === data) {
      return item.image;
    }
  });
}
