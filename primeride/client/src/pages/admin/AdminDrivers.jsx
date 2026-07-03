import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, Pencil, Shield, ShieldCheck } from 'lucide-react';
import { getDrivers, createDriver, updateDriver } from '../../services/driverService';
import AdminLayout from './AdminLayout';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import StarRating from '../../components/ui/StarRating';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const EMPTY = {
  name: '', licenseNumber: '', experienceYears: '', phone: '',
  city: 'Lahore', languages: 'Urdu, English', verified: false,
};

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, driver: null });
  const [form, setForm] = useState(EMPTY);
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => getDrivers().then((r) => setDrivers(r.data.drivers)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY); setPhoto(null); setModal({ open: true, driver: null }); };
  const openEdit = (d) => {
    setForm({ ...EMPTY, ...d, languages: d.languages?.join(', ') || '' });
    setPhoto(null);
    setModal({ open: true, driver: d });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.licenseNumber || !form.phone) { toast.error('Fill required fields'); return; }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append('photo', photo);

      if (modal.driver) {
        await updateDriver(modal.driver._id, fd);
        toast.success('Driver updated');
      } else {
        await createDriver(fd);
        toast.success('Driver added');
      }
      setModal({ open: false, driver: null });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save driver');
    } finally {
      setSubmitting(false);
    }
  };

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <AdminLayout>
      <Helmet><title>Drivers — PrimeRide Admin</title></Helmet>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Drivers</h1>
          <Button leftIcon={<Plus size={16} />} onClick={openAdd}>Add Driver</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {drivers.map((d) => (
              <div key={d._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 overflow-hidden shrink-0">
                    {d.photoUrl ? (
                      <img src={d.photoUrl} alt={d.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-600 font-bold text-lg">
                        {d.name?.[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{d.name}</p>
                      {d.verified ? <ShieldCheck size={14} className="text-green-500" /> : <Shield size={14} className="text-gray-300" />}
                    </div>
                    <p className="text-xs text-gray-400">{d.experienceYears}yr exp · {d.city}</p>
                    <StarRating rating={d.rating} size={12} />
                  </div>
                </div>
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <p>📞 {d.phone}</p>
                  <p>🗣 {d.languages?.join(', ')}</p>
                </div>
                <Button size="sm" variant="secondary" leftIcon={<Pencil size={12} />} onClick={() => openEdit(d)}>
                  Edit
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, driver: null })} title={modal.driver ? 'Edit Driver' : 'Add Driver'}>
        <div className="p-6 space-y-4">
          <Input label="Full Name *" value={form.name} onChange={(e) => f('name', e.target.value)} />
          <Input label="License Number *" value={form.licenseNumber} onChange={(e) => f('licenseNumber', e.target.value)} />
          <Input label="Phone *" value={form.phone} onChange={(e) => f('phone', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Experience (years)" type="number" value={form.experienceYears} onChange={(e) => f('experienceYears', e.target.value)} />
            <Input label="City" value={form.city} onChange={(e) => f('city', e.target.value)} />
          </div>
          <Input label="Languages" value={form.languages} onChange={(e) => f('languages', e.target.value)} placeholder="Urdu, English, Punjabi" />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Profile Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 accent-amber-500" checked={form.verified === true || form.verified === 'true'}
              onChange={(e) => f('verified', e.target.checked)} />
            <span className="text-sm text-gray-700 dark:text-gray-300">Mark as verified</span>
          </label>
          <Button fullWidth onClick={handleSubmit} isLoading={submitting}>
            {modal.driver ? 'Save Changes' : 'Add Driver'}
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
