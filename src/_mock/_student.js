export const GUARDIAN_TYPES = [
  'mother',
  'father',
  'aunt',
  'uncle',
  'brother',
  'grandfather',
  'grandmother',
  'sister',
  'guardian',
  'family friend',
  'other',
  'cousin',
];
export const STUDENT_GENDER = ['male', 'female', 'other'];

export const courses = [
  {
    value: 'master_in_flutter_development',
    label: 'Flutter Development',
  },
  {
    value: 'master_in_android_development',
    label: 'Android Development',
  },
  { value: 'master_in_game_development', label: 'Game Development' },
  {
    value: 'master_in_full_stack_development',
    label: 'Full Stack Development',
  },
  { value: 'master_in_web_development', label: 'Web Development' },
  { value: 'node_js', label: 'Node JS' },
  { value: 'react_js', label: 'React JS' },
  { value: 'python', label: 'Python' },
  { value: 'angular_js', label: 'Angular JS' },
  { value: 'c_programming', label: 'C Programming' },
  { value: 'cpp_programming', label: 'C++ Programming' },
  { value: 'java_programming', label: 'Java Programming' },
  { value: 'ios', label: 'iOS' },
  { value: 'advance_php', label: 'Advance PHP' },
  { value: 'laravel', label: 'Laravel' },
  { value: 'wordpress', label: 'Wordpress' },
  { value: 'master_in_web_design', label: 'Master In Web Design' },
  { value: 'master_in_ui_ux_design', label: 'Master In UI/UX Design' },
  { value: 'advance_graphics_design', label: 'Advance Graphics Design' },
  { value: 'photoshop', label: 'Photoshop' },
  { value: 'ccc_basic_computer_course', label: 'CCC - Basic Computer Course' },
  { value: 'adobe_xd', label: 'Adobe XD' },
  { value: 'adobe_illustrator', label: 'Adobe Illustrator' },
  { value: 'frontend_development', label: 'Frontend Development' },
  { value: 'backend_development', label: 'Backend Development' },
];

export const courseProgress = (course) => {
  switch (course) {
    case 'master_in_flutter_development':
      return [
        'C',
        'C++',
        'State Management',
        'Flutter',
        'Firebase',
        'Dart',
        'Core Java',
        'PHP/NodeJS API Concept',
        'DBMS',
        'Mobile App',
        'Desktop App',
        'Casual Games',
        'Postman',
        'Git Management',
      ];
    case 'master_in_android_development':
      return [
        'C',
        'C++',
        'Android',
        'Firebase',
        'XML Design',
        'Git Management',
        'DBMS',
        'Postman',
        'App Deployment',
        'Java',
        'PHP/NodeJS API Concept',
      ];
    case 'master_in_game_development':
      return [
        'C',
        'C++',
        'MySQL',
        'PHP/NodeJS API Concept',
        'Unity 3D',
        'Git Management',
        'C#',
        'Java',
      ];
    case 'master_in_full_stack_development':
      return [
        'C',
        'C++',
        'API Call',
        'HTML',
        'CSS',
        'Bootstrap',
        'JavaScript',
        'ECMAScript',
        'JQuery',
        'ReactJS/AngularJS/VueJS',
        'Git Management',
        'API Development',
        'MySQL/MongoDB',
        'Express.JS',
        'Node.JS',
      ];
    case 'node_js':
      return ['Node JS'];
    case 'react_js':
      return ['React JS'];
    case 'python':
      return ['Python'];
    case 'angular_js':
      return ['Angular JS'];
    case 'c_programming':
      return [
        'Data Types/Operators',
        'Control Statements/Loops',
        'Array/String',
        'Functions/Pointer/Structure',
        'Dynamic Memory Allocation',
        'File Handling/Graphics',
      ];
    case 'cpp_programming':
      return [
        'Class/Objects',
        'Constructor',
        'Function Overloading',
        'OOPs Concept',
        'Inheritance',
        'File Input & Output',
      ];
    case 'java_programming':
      return ['JAVA Basics', 'OOPs Concept', 'Multithreading', 'Applet', 'Swing', 'JDBC'];
    case 'ios':
      return ['iOS'];
    case 'advance_php':
      return ['Advance PHP'];
    case 'laravel':
      return ['Laravel'];
    case 'wordpress':
      return ['Wordpress'];
    case 'master_in_web_development':
      return [
        'C',
        'C++',
        'JavaScript',
        'Postman',
        'AJAX',
        'Git Management',
        'JQuery',
        'JSON',
        'Web Hosting',
        'HTML',
        'CSS',
        'Bootstrap',
        'MySQL',
        'PHP+ / Python+Django',
      ];
    case 'master_in_web_design':
      return [
        'Photoshop',
        'HTML',
        'CSS',
        'Illustrator',
        'JavaScript',
        'Git Management',
        'JQuery',
        'Figma',
        'Bootstrap',
        'SASS/SCSS',
        'Wordpress',
        'Media Query',
        'Web Hosting',
        'Tailwind CSS',
      ];
    case 'master_in_ui_ux_design':
      return [
        'Photoshop',
        'Figma',
        'Website UI',
        'Illustrator',
        'Game UI',
        'Behance Portfolio',
        'After Effects',
        'Dribbble Portfolio',
        'Promotional Video',
        'Adobe XD',
        'Mobile App UI',
      ];
    case 'advance_graphics_design':
      return [
        'Photoshop',
        'Logo Design',
        'Festival Post Design',
        'Illustrator',
        'Mockup Design',
        'Dribbble Portfolio',
        'CorelDraw',
        'Visiting Card Design',
        'Behance Portfolio',
        'InDesign',
        'Catalog Design',
      ];
    case 'photoshop':
      return ['Photoshop'];
    case 'ccc_basic_computer_course':
      return ['Notepad/Wordpad', 'Paint', 'MS Word/Excel', 'MS PowerPoint', 'Advance Internet'];
    case 'adobe_xd':
      return ['Adobe XD'];
    case 'adobe_illustrator':
      return ['Adobe Illustrator'];
    case 'frontend_development':
      return ['Frontend Development'];
    case 'backend_development':
      return ['Backend Development'];
    default:
      return [];
  }
};
