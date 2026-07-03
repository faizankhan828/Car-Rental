import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STATIC_CARS } from '../data/staticCars';

// This is the single source of truth for cars.
// Admin changes here update the public-facing pages in real time.
export const useCarStore = create(
  persist(
    (set, get) => ({
      cars: STATIC_CARS,

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
          _version: (state._version || 0) + 1,
          cars: state.cars.map((c) => {
            if (c._id !== id) return c;
            const updated = { ...c, ...updates };
            // Handle image URL update
            if (updates.imageUrl !== undefined) {
              updated.images = updates.imageUrl
                ? [{ url: updates.imageUrl }]
                : c.images;
            }
            // Handle features string → array
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
      name: 'primeride-cars', // persisted in localStorage
    }
  )
);
