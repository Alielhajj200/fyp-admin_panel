import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: '' },
  { key: 'customers', title: 'Manage Customers', href: paths.dashboard.customers, icon: '' },
 // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
 // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
 // { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  //{ key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
  { key: 'Products', title: 'Manage Products', href: paths.dashboard.products, icon: '' },
  { key: 'Categories', title: 'Manage Categories', href: paths.dashboard.categories, icon: '' },
  { key: 'Workouts', title: 'Manage Workouts', href: paths.dashboard.workouts, icon: '' },
  { key: 'Orders', title: 'Manage Orders', href: paths.dashboard.orders, icon: '' },
] satisfies NavItemConfig[];
