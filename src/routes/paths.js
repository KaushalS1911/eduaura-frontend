// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  INVITE_USER: '/invite-user',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/hjxMnGUJCjY7pX8lQbS7kn/%5BPreview%5D-Minimal-Web.v5.4.0?type=design&node-id=0-1&mode=design&t=2fxnS70DuiTLGzND-0',
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
    supabase: {
      login: `${ROOTS.AUTH}/supabase/login`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      register: `${ROOTS.AUTH}/supabase/register`,
      newPassword: `${ROOTS.AUTH}/supabase/new-password`,
      forgotPassword: `${ROOTS.AUTH}/supabase/forgot-password`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    setting: `${ROOTS.DASHBOARD}/setting`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,

    general: {
      fees: `${ROOTS.DASHBOARD}/fees`,
      feesInvoice: (id, installmentID) =>
        `${ROOTS.DASHBOARD}/fees/${id}/fee-invoice/${installmentID}/installment`,
    },

    inquiry: {
      root: `${ROOTS.DASHBOARD}/inquiry`,
      new: `${ROOTS.DASHBOARD}/inquiry/new`,
      list: `${ROOTS.DASHBOARD}/inquiry/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/inquiry/${id}/edit`,
    },

    student: {
      root: `${ROOTS.DASHBOARD}/student`,
      new: `${ROOTS.DASHBOARD}/student/new`,
      list: `${ROOTS.DASHBOARD}/student/list`,
      cards: `${ROOTS.DASHBOARD}/student/cards`,
      profile: `${ROOTS.DASHBOARD}/student/profile`,
      account: `${ROOTS.DASHBOARD}/student/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/student/${id}/edit`,
      studentView: (id) => `${ROOTS.DASHBOARD}/student/${id}/studentView`,
      guaridiandetails: (id) => `${ROOTS.DASHBOARD}/student/${id}/guaridiandetails`,
    },

    account: {
      root: `${ROOTS.DASHBOARD}/account`,
    },

    complain: {
      root: `${ROOTS.DASHBOARD}/complain`,
    },

    employee: {
      root: `${ROOTS.DASHBOARD}/employee`,
      new: `${ROOTS.DASHBOARD}/employee/new`,
      list: `${ROOTS.DASHBOARD}/employee/list`,
      cards: `${ROOTS.DASHBOARD}/employee/cards`,
      profile: `${ROOTS.DASHBOARD}/employee/profile`,
      account: `${ROOTS.DASHBOARD}/employee/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/employee/${id}/edit`,
    },

    seminar: {
      root: `${ROOTS.DASHBOARD}/seminar`,
      new: `${ROOTS.DASHBOARD}/seminar/new`,
      list: `${ROOTS.DASHBOARD}/seminar/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/seminar/${id}/edit`,
    },

    // profile: {
    //   root: `${ROOTS.DASHBOARD}/profile`,
    //   list: `${ROOTS.DASHBOARD}/profile/list`,
    //   new: `${ROOTS.DASHBOARD}/profile/new`,
    // },

    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
    },

    expenses: {
      root: `${ROOTS.DASHBOARD}/expenses`,
      list: `${ROOTS.DASHBOARD}/expenses/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/expenses/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/expenses/new`,
    },

    visit: {
      root: `${ROOTS.DASHBOARD}/visit`,
      list: `${ROOTS.DASHBOARD}/visit/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/visit/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/visit/new`,
    },

    examination: {
      root: `${ROOTS.DASHBOARD}/examination`,
      list: `${ROOTS.DASHBOARD}/examination/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/examination/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/examination/new`,
      examoverview: (batchExamId) => `${ROOTS.DASHBOARD}/examination/${batchExamId}/examoverview`,
    },
    assignment: {
      root: `${ROOTS.DASHBOARD}/assignment`,
      list: `${ROOTS.DASHBOARD}/assignment/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/assignment/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/assignment/new`,
      examoverview: (batchExamId) => `${ROOTS.DASHBOARD}/assignment/${batchExamId}/examoverview`,
    },

    task: {
      root: `${ROOTS.DASHBOARD}/task`,
      list: `${ROOTS.DASHBOARD}/task/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/task/${id}/edit`,
      new: `${ROOTS.DASHBOARD}/task/new`,
    },

    batches: {
      root: `${ROOTS.DASHBOARD}/batches`,
      details: (id) => `${ROOTS.DASHBOARD}/batches/${id}`,
      new: `${ROOTS.DASHBOARD}/batches/new`,
      edit: (id) => `${ROOTS.DASHBOARD}/batches/${id}/edit`,
      view: (id) => `${ROOTS.DASHBOARD}/batches/${id}/view`,
    },

    demo: {
      root: `${ROOTS.DASHBOARD}/demo`,
    },

    attendance: {
      root: `${ROOTS.DASHBOARD}/attendance`,
      new: `${ROOTS.DASHBOARD}/attendance/new`,
    },
  },
  inviteUser: {
    root: `${ROOTS.INVITE_USER}`,
  },
};
