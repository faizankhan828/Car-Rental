import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STATIC_CARS } from '../data/staticCars';

// Version this — bump when you want all devices to reset to latest static data
const STORE_VERSION = 2;

export const useCarStore = create(
  persist(
    (set, get) => ({
      cars: STATIC_CARS,
      _storeVersion: STORE_VERSION,

      // Add a new car
      addCar: (car) => {
        const newCar = {
          ...car,
          _id: `car-${Date.now()}`,
          averageRating: 0,
          reviewCount: 0,
          images: car.imageUrl
            ? [{ url: car.imageUrl }]
            : [{ url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&q=80' }],
          features: typeof car.features === 'string'
            ? car.features.split(',').map(f => f.trim()).filter(Boolean)
            : car.features || [],
          pricePerDay: Number(car.pricePerDay),
          year: Number(car.year),
          seats: Number(car.seats),
        };
        set((state) => ({ cars: [newCar, ...state.cars] }));
        return newCar;
      },

      // Update an existing car
      updateCar: (id, updates) => {
        set((state) => ({
          cars: state.cars.map((c) => {
            if (c._id !== id) return c;
            const updated = { ...c, ...updates };
            if (updates.imageUrl !== undefined) {
              updated.images = updates.imageUrl
                ? [{ url: updates.imageUrl }]
                : c.images;
            }
            if (typeof updates.features === 'string') {
              updated.features = updates.features.split(',').map(f => f.trim()).filter(Boolean);
            }
            if (updates.pricePerDay !== undefined) updated.pricePerDay = Number(updates.pricePerDay);
            if (updates.year !== undefined) updated.year = Number(updates.year);
            if (updates.seats !== undefined) updated.seats = Number(updates.seats);
            return updated;
          }),
        }));
      },

      // Delete a car
      deleteCar: (id) => {
        set((state) => ({ cars: state.cars.filter((c) => c._id !== id) }));
      },

      // Reset to defaults
      resetToDefaults: () => set({ cars: STATIC_CARS }),

      // Get single car
      getCarById: (id) => get().cars.find((c) => c._id === id),
    }),
    {
      name: 'primeride-cars-v2', // changed key = all devices start fresh
      onRehydrateStorage: () => (state) => {
        // If the stored version doesn't match, reset to static defaults
        if (state && state._storeVersion !== STORE_VERSION) {
          state.cars = STATIC_CARS;
          state._storeVersion = STORE_VERSION;
        }
      },
    }
  )
);
