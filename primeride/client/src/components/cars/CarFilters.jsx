import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { CITIES, CATEGORIES } from '../../utils/helpers';

export default function CarFilters({ filters, onChange, onReset }) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c,
    label: c.charAt(0).toUpperCase() + c.slice(1),
  }));
  const cityOptions = CITIES.map((c) => ({ value: c, label: c }));
  const transmissionOptions = [
    { value: 'automatic', label: 'Automatic' },
    { value: 'manual', label: 'Manual' },
  ];
  const seatsOptions = [2, 4, 5, 7, 8, 12].map((n) => ({ value: n, label: `${n}+ seats` }));

  const FiltersContent = () => (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="w-full sm:w-36">
        <Select
          value={filters.category || ''}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>

      <div className="w-full sm:w-36">
        <Select
          value={filters.city || ''}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
        >
          <option value="">All Cities</option>
          {cityOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>

      <div className="w-full sm:w-36">
        <Select
          value={filters.transmission || ''}
          onChange={(e) => onChange({ ...filters, transmission: e.target.value })}
        >
          <option value="">Transmission</option>
          {transmissionOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>

      <div className="w-full sm:w-32">
        <Select
          value={filters.seats || ''}
          onChange={(e) => onChange({ ...filters, seats: e.target.value })}
        >
          <option value="">Any Seats</option>
          {seatsOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>

      <div className="w-28">
        <Input
          placeholder="Min price"
          type="number"
          value={filters.priceMin || ''}
          onChange={(e) => onChange({ ...filters, priceMin: e.target.value })}
        />
      </div>

      <div className="w-28">
        <Input
          placeholder="Max price"
          type="number"
          value={filters.priceMax || ''}
          onChange={(e) => onChange({ ...filters, priceMax: e.target.value })}
        />
      </div>

      {/* Chauffeur checkbox */}
      <label className="flex items-center gap-2.5 cursor-pointer py-3 px-4 rounded-xl border border-[#2E2E2E] dark:border-zinc-200 hover:border-[#444444] dark:hover:border-zinc-400 transition-colors group">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-[#444444] dark:border-zinc-400 accent-[#A8B2C1]"
          checked={filters.withDriver === 'true' || filters.withDriver === true}
          onChange={(e) => onChange({ ...filters, withDriver: e.target.checked ? 'true' : '' })}
        />
        <span className="text-xs text-[#888888] dark:text-zinc-500 whitespace-nowrap group-hover:text-[#CCCCCC] dark:group-hover:text-zinc-700 transition-colors tracking-wide">
          With Chauffeur
        </span>
      </label>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 px-4 py-3 text-xs text-[#666666] dark:text-zinc-500 hover:text-[#CCCCCC] dark:hover:text-zinc-700 rounded-xl hover:bg-white/[0.04] dark:hover:bg-black/[0.04] transition-colors tracking-wide"
      >
        <X size={13} strokeWidth={1.5} />
        Clear
      </button>
    </div>
  );

  return (
    <div>
      {/* Desktop */}
      <div className="hidden md:block">
        <FiltersContent />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<SlidersHorizontal size={14} strokeWidth={1.5} />}
          onClick={() => setShowMobileFilters((v) => !v)}
        >
          Filters {showMobileFilters ? '▲' : '▼'}
        </Button>
        {showMobileFilters && (
          <div className="mt-4 p-4 bg-[#0D0D0D] dark:bg-zinc-50 rounded-xl border border-[#222222] dark:border-zinc-200">
            <FiltersContent />
          </div>
        )}
      </div>
    </div>
  );
}
