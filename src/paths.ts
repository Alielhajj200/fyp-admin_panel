export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    products:'/dashboard/products',
    categories:'/dashboard/categories',
    workouts:'/dashboard/workouts',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    orders:'/dashboard/orders'
  },
  errors: { notFound: '/errors/not-found' },
} as const;
