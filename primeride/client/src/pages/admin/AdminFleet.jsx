import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Pencil, Trash2, X, Save, Car, Upload, RefreshCw } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { getCars, adminCreateCar, adminUpdateCar, adminDeleteCar } from '../../services/carService';
import { uploadToCloudinary } from '../../services/cloudinaryUpload';
import toast from 'react-hot-toast';

const CITIES      = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar'];
const CATEGORIES  = ['hatchback', 'sedan', 'suv', 'crossover', 'luxury', 'van'];
const FUEL_TYPES  = ['Petrol', 'Diesel', 'CNG', 'Hybrid', 'Electric'];

const EMPTY = {
  brand: '', model: '', year: new Date().getFullYear(), category: 'sedan',
  transmission: 'automatic', seats: 5, fuelType: 'petrol',
  pricePerDay: '', city: 'Lahore', withDriverAvailable: false,
  description: '', features: '', imageUrl: '',
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
  const [cars, setCars]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [errors, setErrors]         = useState({});
  const [saving, setSaving]         = useState(false);
  const [search, setSearch]         = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadCars = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCars({ limit: 100 });
      setCars(res.data.cars || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load cars from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCars(); }, [loadCars]);

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
      brand:              car.brand || '',
      model:              car.model || '',
      year:               car.year || new Date().getFullYear(),
      category:           car.category || 'sedan',
      transmission:       car.transmission || 'automatic',
      seats:              car.seats || 5,
      fuelType:           car.fuelType || 'petrol',
      pricePerDay:        car.pricePerDay || '',
      city:               car.city || 'Lahore',
      withDriverAvailable: car.withDriverAvailable || false,
      description:        car.description || '',
      features:           Array.isArray(car.features) ? car.features.join(', ') : car.features || '',
      imageUrl:           car.images?.[0]?.url || '',
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }

    setUploadingImage(true);
    try {
      const { url } = await uploadToCloudinary(file);
      setForm(f => ({ ...f, imageUrl: url }));
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.brand.trim())                           e.brand       = 'Required';
    if (!form.model.trim())                           e.model       = 'Required';
    if (!form.pricePerDay || Number(form.pricePerDay) <= 0) e.pricePerDay = 'Enter a valid price';
    if (!form.year || form.year < 2000 || form.year > 2030) e.year  = 'Enter a valid year';
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      // Build payload for MongoDB
      const payload = {
        title:              `${form.brand} ${form.model}`,
        brand:              form.brand.trim(),
        model:              form.model.trim(),
        year:               Number(form.year),
        category:           form.category,
        transmission:       form.transmission,
        seats:              Number(form.seats),
        fuelType:           form.fuelType.toLowerCase(),
        pricePerDay:        Number(form.pricePerDay),
        city:               form.city,
        withDriverAvailable: form.withDriverAvailable,
        description:        form.description.trim(),
        features:           form.features ? form.features.split(',').map(f => f.trim()).filter(Boolean) : [],
        status:             'available',
      };

      // Attach image if provided
      if (form.imageUrl) {
        payload.images = [{ url: form.imageUrl, publicId: '' }];
      }

      if (editing) {
        await adminUpdateCar(editing, payload);
        toast.success(`${form.brand} ${form.model} updated`);
      } else {
        await adminCreateCar(payload);
        toast.success(`${form.brand} ${form.model} added to fleet`);
      }

      setModalOpen(false);
      loadCars(); // refresh from server — all devices now see the change
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save car');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (car) => {
    if (!window.confirm(`Delete ${car.brand} ${car.model}? This cannot be undone.`)) return;
    try {
      await adminDeleteCar(car._id);
      toast.success(`${car.brand} ${car.model} removed`);
      setCars(prev => prev.filter(c => c._id !== car._id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete car');
    }
  };

  const setField = (field) => (e) => {
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
            <p className="text-gray-400 text-sm mt-0.5">
              Changes save to MongoDB — visible on all devices instantly
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadCars}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-xl transition-colors text-sm"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
            >
              <Plus size={16} /> Add New Car
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Car size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
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
          <div className="px-5 py-3.5 border-b border-gray-700">
            <p className="text-sm font-medium text-gray-300">
              {loading ? 'Loading...' : `${filtered.length} car${filtered.length !== 1 ? 's' : ''}`}
            </p>
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
                {loading && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-500">Loading cars from server...</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                    No cars found. <button onClick={openAdd} className="text-blue-400 hover:text-blue-300">Add one?</button>
                  </td></tr>
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
                    <td className="px-5 py-3.5 capitalize text-gray-300">{car.category}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        car.transmission === 'automatic' ? 'bg-purple-500/15 text-purple-400' : 'bg-gray-700 text-gray-400'
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
                        <button onClick={() => openEdit(car)} className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(car)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
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

      {/* ── Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 overflow-y-auto">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl mb-8">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <h2 className="text-base font-bold text-white">{editing ? 'Edit Car' : 'Add New Car'}</h2>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Brand" required error={errors.brand}>
                  <input value={form.brand} onChange={setField('brand')} placeholder="Toyota" className={inp} />
                </Field>
                <Field label="Model" required error={errors.model}>
                  <input value={form.model} onChange={setField('model')} placeholder="Corolla GLi" className={inp} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Year" required error={errors.year}>
                  <input type="number" value={form.year} onChange={setField('year')} min={2000} max={2030} className={inp} />
                </Field>
                <Field label="Price Per Day (PKR)" required error={errors.pricePerDay}>
                  <input type="number" value={form.pricePerDay} onChange={setField('pricePerDay')} placeholder="7000" min={0} className={inp} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
                  <select value={form.category} onChange={setField('category')} className={sel}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </Field>
                <Field label="Transmission">
                  <select value={form.transmission} onChange={setField('transmission')} className={sel}>
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Field label="City">
                  <select value={form.city} onChange={setField('city')} className={sel}>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Fuel Type">
                  <select value={form.fuelType} onChange={setField('fuelType')} className={sel}>
                    {FUEL_TYPES.map(f => <option key={f} value={f.toLowerCase()}>{f}</option>)}
                  </select>
                </Field>
                <Field label="Seats">
                  <input type="number" value={form.seats} onChange={setField('seats')} min={2} max={15} className={inp} />
                </Field>
              </div>

              <Field label="Car Image">
                <input
                  value={form.imageUrl}
                  onChange={setField('imageUrl')}
                  placeholder="Paste image URL or upload below"
                  className={inp}
                />
                <label className={`mt-2 flex items-center justify-center gap-2.5 w-full py-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                  uploadingImage ? 'border-blue-500/40 bg-blue-500/5' : 'border-gray-600 hover:border-blue-500/50 hover:bg-blue-500/5'
                }`}>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => handleImageUpload(e.target.files?.[0])} className="sr-only" disabled={uploadingImage} />
                  <Upload size={15} className={uploadingImage ? 'text-blue-400' : 'text-gray-400'} />
                  <span className={`text-sm ${uploadingImage ? 'text-blue-400' : 'text-gray-400'}`}>
                    {uploadingImage ? 'Uploading...' : 'Click to upload (JPG/PNG/WebP, max 5MB)'}
                  </span>
                </label>
                {form.imageUrl && (
                  <img src={form.imageUrl} alt="Preview" className="mt-2 h-28 w-full object-cover rounded-xl bg-gray-700" onError={e => { e.target.style.display = 'none'; }} />
                )}
              </Field>

              <Field label="Description">
                <textarea value={form.description} onChange={setField('description')} placeholder="Brief description..." rows={3} className={inp + ' resize-none'} />
              </Field>

              <Field label="Features (comma-separated)">
                <input value={form.features} onChange={setField('features')} placeholder="AC, Bluetooth, Sunroof, Rear Camera" className={inp} />
              </Field>

              <label className="flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-xl cursor-pointer hover:border-gray-600 transition-colors">
                <input type="checkbox" checked={form.withDriverAvailable} onChange={setField('withDriverAvailable')} className="w-4 h-4 rounded text-blue-600 border-gray-500 cursor-pointer" />
                <div>
                  <p className="text-sm font-semibold text-gray-200">Driver Available</p>
                  <p className="text-xs text-gray-500">Check if a professional driver can be arranged</p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-100 hover:bg-gray-800 transition-colors border border-gray-700">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : <Save size={15} />}
                {editing ? 'Save Changes' : 'Add Car'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
