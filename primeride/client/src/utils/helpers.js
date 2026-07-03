import { differenceInCalendarDays, format, parseISO } from 'date-fns';

export const formatDate = (date, fmt = 'MMM d, yyyy') => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, fmt);
};

export const calcDays = (pickup, dropoff) => {
  if (!pickup || !dropoff) return 0;
  return Math.max(1, differenceInCalendarDays(new Date(dropoff), new Date(pickup)));
};

export const calcPricing = (car, days, withDriver) => {
  const DRIVER_FEE_PER_DAY = 2000;
  const SERVICE_FEE_PERCENT = 0.05;

  const basePrice = (car?.pricePerDay || 0) * days;
  const driverFee = withDriver ? DRIVER_FEE_PER_DAY * days : 0;
  const serviceFee = Math.round((basePrice + driverFee) * SERVICE_FEE_PERCENT);
  const totalPrice = basePrice + driverFee + serviceFee;

  return { basePrice, driverFee, serviceFee, totalPrice, days };
};

export const getStatusColor = (status) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    completed: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return map[status] || map.pending;
};

export const getPaymentStatusColor = (status) => {
  const map = {
    unpaid: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  };
  return map[status] || map.unpaid;
};

export const categoryLabel = (cat) => {
  const map = {
    sedan: 'Sedan',
    suv: 'SUV',
    crossover: 'Crossover',
    luxury: 'Luxury',
    van: 'Van',
  };
  return map[cat] || cat;
};

export const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar'];
export const CATEGORIES = ['sedan', 'suv', 'crossover', 'luxury', 'van'];
export const WHATSAPP_NUMBER = process.env.VITE_WHATSAPP_NUMBER || '923001234567';
