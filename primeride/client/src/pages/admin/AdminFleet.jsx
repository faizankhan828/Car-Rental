import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Pencil, Trash2, X, Save, Car } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useCarStore } from '../../store/carStore';
import { uploadCarImage } from '../../services/carService';
import toast from 'react-hot-toast';

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar'];
const CATEGORIES = ['hatchback', 'sedan', 'suv', 'crossover', 'luxury', 'van'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Hybrid', 'Electric'];

const EMPTY = {
  brand: '', model: '', year: new Date().getFullYear(), category: 'sedan',
  transmission: 'automatic', seats: 5, fuelType: 'Petrol',
  pricePerDay: '', city: 'Lahore',
  withDriverAvailable: false, description: '',
  features: '', imageUrl: '',
};

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

const inp = "w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
const sel = inp + " cursor-pointer appearance-none";

export default function AdminFleet() {
  const { cars, addCar, updateCar, deleteCar } = useCarStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = adding new
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const filtered = cars.filter(c =>
    `${c.brand} ${c.model} ${c.city}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (car) => {
    setEditing(car._id);
    setForm({
      brand: car.brand || '',
      model: car.model || '',
      year: car.year || new Date().getFullYear(),
      category: car.category || 'sedan',
      transmission: car.transmission || 'automatic',
      seats: car.seats || 5,
      fuelType: car.fuelType || 'Petrol',
      pricePerDay: car.pricePerDay || '',
      city: car.city || 'Lahore',
      withDriverAvailable: car.withDriverAvailable || false,
      description: car.description || '',
      features: Array.isArray(car.features) ? car.features.join(', ') : car.features || '',
      imageUrl: car.images?.[0]?.url || '',
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await uploadCarImage(formData);
      setForm((current) => ({ ...current, imageUrl: data.image.url }));
      toast.success('Image uploaded to Cloudinary');
    } catch (err) {
      console.error('Upload error details:', err);
      toast.error(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.brand.trim()) e.brand = 'Required';
    if (!form.model.trim()) e.model = 'Required';
    if (!form.pricePerDay || Number(form.pricePerDay) <= 0) e.pricePerDay = 'Enter a valid price';
    if (!form.year || form.year < 2000 || form.year > 2030) e.year = 'Enter a valid year';
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (editing) {
      updateCar(editing, form);
      toast.success(`${form.brand} ${form.model} updated`);
    } else {
      addCar(form);
      toast.success(`${form.brand} ${form.model} added to fleet`);
    }
    setModalOpen(false);
  };

  const handleDelete = (car) => {
    if (!window.confirm(`Delete ${car.brand} ${car.model}? This cannot be undone.`)) return;
    deleteCar(car._id);
    toast.success(`${car.brand} ${car.model} removed`);
  };

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
    setErrors(er => ({ ...er, [field]: '' }));
  };

  return (
    <AdminLayout>
      <Helmet><title>Manage Cars — PrimeRide Admin</title></Helmet>

      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Cars</h1>
            <p className="text-gray-400 text-sm mt-0.5">Changes appear on the public site instantly</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
          >
            <Plus size={16} /> Add New Car
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Car size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search by brand, model or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full sm:max-w-sm bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-700 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-300">{filtered.length} car{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-900/50">
                  {['Car', 'Price / Day', 'City', 'Category', 'Trans.', 'Driver', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                      No cars found. <button onClick={openAdd} className="text-blue-400 hover:text-blue-300">Add one?</button>
                    </td>
                  </tr>
                )}
                {filtered.map(car => (
                  <tr key={car._id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={car.images?.[0]?.url || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=120'}
                          alt={car.brand}
                          className="w-14 h-9 rounded-lg object-cover bg-gray-700 shrink-0"
                          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=120'; }}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-100 truncate">{car.brand} {car.model}</p>
                          <p className="text-xs text-gray-500">{car.year} · {car.seats} seats</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-green-400 whitespace-nowrap">
                      PKR {Number(car.pricePerDay).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-gray-300">{car.city}</td>
                    <td className="px-5 py-3.5">
                      <span className="capitalize text-gray-300">{car.category}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        car.transmission === 'automatic'
                          ? 'bg-purple-500/15 text-purple-400'
                          : 'bg-gray-700 text-gray-400'
                      }`}>
                        {car.transmission === 'automatic' ? 'Auto' : 'Manual'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        car.withDriverAvailable
                          ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                          : 'bg-gray-700/50 text-gray-500'
                      }`}>
                        {car.withDriverAvailable ? '✓ Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(car)}
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                          title="Edit car"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(car)}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete car"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 overflow-y-auto">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />

          <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl mb-4">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-base font-bold text-white">
                {editing ? 'Edit Car' : 'Add New Car'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-5">

              {/* Row 1: Brand + Model */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Brand" required error={errors.brand}>
                  <input value={form.brand} onChange={set('brand')} placeholder="Toyota" className={inp} />
                </Field>
                <Field label="Model" required error={errors.model}>
                  <input value={form.model} onChange={set('model')} placeholder="Corolla GLi" className={inp} />
                </Field>
              </div>

              {/* Row 2: Year + Price */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Year" required error={errors.year}>
                  <input type="number" value={form.year} onChange={set('year')} min={2000} max={2030} className={inp} />
                </Field>
                <Field label="Price Per Day (PKR)" required error={errors.pricePerDay}>
                  <input type="number" value={form.pricePerDay} onChange={set('pricePerDay')} placeholder="7000" min={0} className={inp} />
                </Field>
              </div>

              {/* Row 3: Category + Transmission */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select value={form.category} onChange={set('category')} className={sel}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </Field>
                <Field label="Transmission">
                  <select value={form.transmission} onChange={set('transmission')} className={sel}>
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </Field>
              </div>

              {/* Row 4: City + Fuel + Seats */}
              <div className="grid grid-cols-3 gap-4">
                <Field label="City">
                  <select value={form.city} onChange={set('city')} className={sel}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Fuel Type">
                  <select value={form.fuelType} onChange={set('fuelType')} className={sel}>
                    {FUEL_TYPES.map(f => <option key={f}>{f}</option>)}
                  </select>
                </Field>
                <Field label="Seats">
                  <input type="number" value={form.seats} onChange={set('seats')} min={1} max={15} className={inp} />
                </Field>
              </div>

              {/* Image URL */}
              <Field label="Car Image (optional)">
                <input
                  value={form.imageUrl}
                  onChange={set('imageUrl')}
                  placeholder="https://example.com/car.jpg"
                  className={inp}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files?.[0])}
                  className="mt-2 block w-full text-xs text-gray-400 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-700 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-600"
                />
                {uploadingImage && <p className="mt-2 text-xs text-gray-400">Uploading image to Cloudinary...</p>}
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="mt-2 h-24 w-full object-cover rounded-xl bg-gray-700"
                    onError={e => e.target.style.display = 'none'}
                  />
                )}
              </Field>

              {/* Description */}
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  placeholder="Brief description of the car..."
                  rows={3}
                  className={inp + ' resize-none'}
                />
              </Field>

              {/* Features */}
              <Field label="Features (comma-separated)">
                <input
                  value={form.features}
                  onChange={set('features')}
                  placeholder="Air Conditioning, Bluetooth, Sunroof, Rear Camera"
                  className={inp}
                />
              </Field>

              {/* Driver checkbox */}
              <label className="flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-xl cursor-pointer hover:border-gray-600 transition-colors">
                <input
                  type="checkbox"
                  checked={form.withDriverAvailable}
                  onChange={set('withDriverAvailable')}
                  className="w-4 h-4 rounded text-blue-600 border-gray-500 cursor-pointer"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-200">Driver Available</p>
                  <p className="text-xs text-gray-500">Check if a professional driver can be arranged for this car</p>
                </div>
              </label>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors border border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
              >
                <Save size={15} />
                {editing ? 'Save Changes' : 'Add Car'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
