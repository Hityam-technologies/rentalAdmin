export const CAR_STATUSES = ['Available', 'On Rent', 'In Service'];

export const CAR_CATEGORIES = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Luxury', 'Electric'];

export const CAR_TYPES = ['Economy', 'Premium Sedan', 'SUV Series', 'Full-size SUV', 'Luxury', 'Electric'];

export const TRANSMISSIONS = ['Manual', 'Automatic', 'CVT', '7-Speed DCT', '6-Speed Auto'];

export const FEATURE_OPTIONS = [
    'Air Condition',
    'Bluetooth',
    'USB Charger',
    'Keyless Entry',
    'Sunroof',
    'Cruise Control',
    'Touchscreen',
    '360 Camera',
    'ADAS',
    'Ventilated Seats',
];

export const DOCUMENT_TYPES = [
    { key: 'rc', label: 'Registration (RC)', icon: 'document-text-outline', required: true },
    { key: 'insurance', label: 'Insurance', icon: 'shield-checkmark-outline', required: true },
    { key: 'puc', label: 'Pollution (PUC)', icon: 'leaf-outline', required: true },
    { key: 'permit', label: 'Commercial Permit', icon: 'ribbon-outline', required: false },
];

export const getStatusStyle = (status) => {
    const map = {
        Available: { statusColor: '#10b981', statusBg: '#ecfdf5' },
        'On Rent': { statusColor: '#3b82f6', statusBg: '#eff6ff' },
        'In Service': { statusColor: '#ef4444', statusBg: '#fef2f2' },
    };
    return map[status] || map.Available;
};

const emptyDoc = () => ({ uploaded: false, imageUri: null, number: '', expiry: '' });

export const createEmptyCarForm = () => ({
    name: '',
    subtitle: '',
    category: 'SUV',
    type: 'SUV Series',
    status: 'Available',
    plate: '',
    location: '',
    price: '',
    rating: '4.5',
    coverPhotoUri: null,
    view360Url: '',
    transmission: 'Manual',
    fuelLeft: '',
    drivenKm: '',
    topSpeed: '',
    acceleration: '',
    seats: '5',
    selectedFeatures: ['Air Condition', 'Bluetooth'],
    description: '',
    aiTip: '',
    documents: {
        rc: emptyDoc(),
        insurance: emptyDoc(),
        puc: emptyDoc(),
        permit: emptyDoc(),
    },
});

export const buildCarFromForm = (form, normalizeWebUrl) => {
    const statusStyle = getStatusStyle(form.status);
    const defaultImage =
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80';
    const image = form.coverPhotoUri || defaultImage;
    const view360 = normalizeWebUrl ? normalizeWebUrl(form.view360Url) : form.view360Url;

    return {
        id: String(Date.now()),
        name: form.name.trim(),
        subtitle: form.subtitle.trim(),
        type: form.type,
        category: form.category,
        status: form.status,
        ...statusStyle,
        rating: form.rating || '4.5',
        reviews: '(New)',
        image,
        images: [image],
        coverPhotoUri: form.coverPhotoUri,
        view360Url: view360,
        location: form.location.trim(),
        price: form.price.replace(/,/g, ''),
        plate: form.plate.trim().toUpperCase(),
        odometer: form.drivenKm.trim() || '0 km',
        specs: {
            transmission: form.transmission,
            fuelLeft: form.fuelLeft.trim() || '—',
            drivenKm: form.drivenKm.trim() || '0 km',
            topSpeed: form.topSpeed.trim() || '—',
            acceleration: form.acceleration.trim() || '—',
            seats: form.seats || '5',
        },
        features: form.selectedFeatures?.length ? form.selectedFeatures : ['Air Condition'],
        description: form.description.trim(),
        aiPrediction: {
            level: 'New Asset',
            color: '#2563eb',
            bg: '#eff6ff',
            border: '#bfdbfe',
            tip:
                form.aiTip.trim() ||
                'Newly added to fleet. Track utilization and adjust daily rates after the first booking cycle.',
        },
        documentsMeta: form.documents,
        regNo: form.plate.trim().toUpperCase(),
    };
};

export const validateCarForm = (form) => {
    const errors = {};

    if (!form.name.trim()) errors.name = 'Vehicle name is required';
    if (!form.subtitle.trim()) errors.subtitle = 'Short description is required';
    if (!form.plate.trim()) errors.plate = 'License plate is required';
    if (!form.location.trim()) errors.location = 'Hub location is required';
    if (!form.price.trim()) errors.price = 'Daily rate is required';
    else if (Number.isNaN(Number(form.price.replace(/,/g, '')))) errors.price = 'Enter a valid daily rate';

    if (!form.coverPhotoUri) errors.coverPhoto = 'Upload a cover photo of the vehicle';

    if (!form.drivenKm.trim()) errors.drivenKm = 'Odometer reading is required';
    if (!form.description.trim()) errors.description = 'Vehicle description is required';

    DOCUMENT_TYPES.forEach((docType) => {
        const doc = form.documents[docType.key];
        if (!docType.required) return;
        if (!doc.imageUri) {
            errors[docType.key] = `Upload ${docType.label} photo`;
            return;
        }
        if (docType.key === 'rc' && !doc.number.trim()) errors.rc = 'RC number is required';
        if (docType.key === 'insurance' && !doc.number.trim()) errors.insurance = 'Policy number is required';
    });

    return errors;
};

export const countUploadedDocs = (documents) =>
    Object.values(documents || {}).filter((d) => d.imageUri).length;
