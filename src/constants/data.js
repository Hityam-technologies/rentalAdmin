// ════════════════════════════════════════════════════════════════════════
// ALL APP CENTRALIZED DUMMY DATA (IN INR ₹)
// ════════════════════════════════════════════════════════════════════════

export const inventoryList = [
    {
        id: '1',
        name: 'Maruti Suzuki Swift',
        subtitle: 'Premium Urban Hatchback',
        type: 'Economy',
        category: 'Hatchback',
        status: 'Available',
        statusColor: '#10b981',
        statusBg: '#ecfdf5',
        rating: '4.8',
        reviews: '(1.2k)',
        image: 'https://imgd.aeplcdn.com/664x374/n/ues0egb_1840524.jpg?q=80',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/ues0egb_1840524.jpg?q=80',
            'https://img.gaadicdn.com/editorial/gallery/6620f4f9dbe4f.jpg',
            'https://img.gaadicdn.com/editorial/gallery/6620f4fa9b0e2.jpg'
        ],
        location: 'Downtown Fleet Hub, Bay 02',
        price: '2,500',
        specs: { transmission: 'Manual', fuelLeft: '85% Fuel', drivenKm: '24,500 km', topSpeed: '165 km/h', acceleration: '11.5s', seats: '5' },
        features: ['Air Condition', 'Bluetooth', 'Compact Size', 'USB Charger', 'Keyless Entry'],
        description: 'Enjoy agile handling and excellent fuel efficiency with the Maruti Swift. A compact hatchback perfect for zipping through urban traffic with premium cabin utilities.',
        aiPrediction: {
            level: 'High Demand',
            color: '#db2777',
            bg: '#fdf2f8',
            border: '#fbcfe8',
            tip: 'City commuter bookings are peaking. Maintain 100% availability for weekend getaways.'
        }
    },
    {
        id: '2',
        name: 'Maruti Suzuki Brezza',
        subtitle: 'Compact Smart SUV',
        type: 'SUV Series',
        category: 'SUV',
        status: 'On Rent',
        statusColor: '#3b82f6',
        statusBg: '#eff6ff',
        rating: '4.9',
        reviews: '(850)',
        image: 'https://i.pinimg.com/736x/5a/9c/1d/5a9c1dde8d4377343b270c59dc068e8f.jpg',
        images: [
            'https://i.pinimg.com/736x/5a/9c/1d/5a9c1dde8d4377343b270c59dc068e8f.jpg',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/123185/brezza-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/123185/brezza-exterior-right-rear-three-quarter.jpeg?isig=0&q=80'
        ],
        location: 'Airport Terminal Hub',
        price: '3,500',
        specs: { transmission: 'Auto', fuelLeft: '45L Gas', drivenKm: '18,200 km', topSpeed: '180 km/h', acceleration: '10.2s', seats: '5' },
        features: ['Sunroof', 'Touchscreen Infotainment', 'Cruise Control', 'Wireless Charging', '360 Camera'],
        description: 'The all-new Maruti Suzuki Brezza brings high-tech features and bold SUV styling. Outstanding ground clearance and an advanced automatic gearbox make it ideal for airport transfers and long road trips.',
        aiPrediction: {
            level: 'Extreme Demand',
            color: '#d97706',
            bg: '#fffbeb',
            border: '#fde68a',
            tip: 'Airport pickups surge expected. Adjust dynamic rate upwards by 10% during peak flights.'
        }
    },
    {
        id: '3',
        name: 'Hyundai Verna',
        subtitle: 'Futuristic Turbo Sedan',
        type: 'Premium Sedan',
        category: 'Sedan',
        status: 'Available',
        statusColor: '#10b981',
        statusBg: '#ecfdf5',
        rating: '4.9',
        reviews: '(940)',
        image: 'https://images.autox.com/uploads/2023/03/Hyundai-Verna-Starry-Night-500x261.jpg',
        images: [
            'https://images.autox.com/uploads/2023/03/Hyundai-Verna-Starry-Night-500x261.jpg',
            'https://cdn-s3.autocarindia.com/legacy/cdni/Galleries/20251207010308_Hyundai_Verna_Atlas_White_Dual_Tone.png?w=728&q=75',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/121943/verna-exterior-right-front-three-quarter-101.jpeg?isig=0&q=80'
        ],
        location: 'Uptown Premium Bay',
        price: '4,200',
        specs: { transmission: '7-Speed DCT', fuelLeft: '92% Fuel', drivenKm: '12,400 km', topSpeed: '210 km/h', acceleration: '8.1s', seats: '5' },
        features: ['ADAS Level 2', 'Ventilated Seats', 'Bose Premium Sound', 'Smart Trunk', 'Ambient Lighting'],
        description: 'Spectacular futuristic styling backed by a thrilling 1.5L Turbo engine. The Hyundai Verna delivers executive luxury, ADAS safety, and segment-first comfort amenities.',
        aiPrediction: {
            level: 'Extreme Demand',
            color: '#d97706',
            bg: '#fffbeb',
            border: '#fde68a',
            tip: 'Executive rental inquiries up by 35%. Enable premium chauffeur add-on package.'
        }
    },
    {
        id: '4',
        name: 'Mahindra Scorpio-N',
        subtitle: 'Big Daddy Power SUV',
        type: 'Full-size SUV',
        category: 'SUV',
        status: 'In Service',
        statusColor: '#ef4444',
        statusBg: '#fef2f2',
        rating: '4.8',
        reviews: '(1.6k)',
        image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/128413/scorpio-exterior-right-front-three-quarter-46.jpeg?isig=0&q=80',
        images: [
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/128413/scorpio-exterior-right-front-three-quarter-46.jpeg?isig=0&q=80',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/128413/scorpio-exterior-right-rear-three-quarter-47.jpeg?isig=0&q=80',
            'https://imgd.aeplcdn.com/664x374/n/cw/ec/128413/scorpio-dashboard-57.jpeg?isig=0&q=80'
        ],
        location: 'Workshop Hub A',
        price: '5,500',
        specs: { transmission: '6-Speed Auto', fuelLeft: '30L Gas', drivenKm: '35,100 km', topSpeed: '190 km/h', acceleration: '9.8s', seats: '7' },
        features: ['4x4 Terrain Mode', 'Captain Seats', 'Sony 3D Audio', 'Powered Driver Seat', 'Dual Zone AC'],
        description: 'True ladder-frame SUV capability engineered for unmatched road dominance. Commanding driver position, advanced 4x4 modes, and plush 7-seat seating configuration.',
        aiPrediction: {
            level: 'Normal Demand',
            color: '#52525b',
            bg: '#f4f4f5',
            border: '#e4e4e7',
            tip: 'Standard 5,000 km routine service underway. Asset will be back online by 5 PM today.'
        }
    }
];

// ── Dashboard Screen Data ──────────────────────────────────────────────
export const heroData = {
    todayRevenue: '₹3,18,400',
    deltaPct: '+18.2%',
    bookingsToday: 14,
    bookingsDelta: '+21%',
    utilizationPct: 67,
    utilOf: '28 of 42',
};

export const sparklineData = [2.1, 2.8, 2.4, 3.2, 2.9, 3.6, 3.84];

export const dashboardStats = [
    { label: 'Total Cars', value: '42', icon: 'car-sport', accent: '#004f8f', accentBg: '#e0edff', sub: 'Fleet size' },
    { label: 'Available', value: '10', icon: 'checkmark-circle', accent: '#059669', accentBg: '#d1fae5', sub: 'Ready now' },
    { label: 'On Rent', value: '28', icon: 'key', accent: '#7c3aed', accentBg: '#ede9fe', sub: 'With customers' },
    { label: 'Returns Today', value: '8', icon: 'time', accent: '#d97706', accentBg: '#fef3c7', sub: 'Expected back' },
];

export const weekData = {
    bookings: [12, 18, 15, 22, 19, 28, 14],
    revenue: [2.4, 3.6, 3.0, 4.4, 3.8, 5.6, 3.8],
};

export const fleetSegments = [
    { label: 'On Rent', value: 28, color: '#004f8f' },
    { label: 'Available', value: 10, color: '#10b981' },
    { label: 'In Service', value: 4, color: '#f59e0b' },
];

export const aiInsightsData = [
    {
        number: '01',
        icon: 'flame',
        label: 'Trending',
        value: 'Maruti Brezza',
        sub: '38 bookings this week',
        action: 'View Details',
        confidence: 92,
        gradient: ['#fb923c', '#ea580c', '#9a3412'],
    },
    {
        number: '02',
        icon: 'time',
        label: 'Peak Window',
        value: '6 PM – 9 PM',
        sub: '64% of daily bookings',
        action: 'Optimize Slots',
        confidence: 87,
        gradient: ['#a855f7', '#7c3aed', '#5b21b6'],
    },
    {
        number: '03',
        icon: 'trending-up',
        label: 'Pricing Tip',
        value: 'Raise rate by 5%',
        sub: 'Est. +₹12,400 this week',
        action: 'Apply Now',
        confidence: 78,
        gradient: ['#34d399', '#059669', '#065f46'],
    },
    {
        number: '04',
        icon: 'people',
        label: 'New Segment',
        value: 'Corporate +32%',
        sub: 'Surge in weekday rentals',
        action: 'See Customers',
        confidence: 84,
        gradient: ['#60a5fa', '#2563eb', '#1e3a8a'],
    },
];

export const quickActionsData = [
    { label: 'Add Car', icon: 'add-circle', gradient: ['#3b82f6', '#1d4ed8'] },
    { label: 'Reports', icon: 'document-text', gradient: ['#10b981', '#047857'] },
    { label: 'Customers', icon: 'people', gradient: ['#a855f7', '#7c3aed'] },
    { label: 'Pricing', icon: 'pricetag', gradient: ['#f59e0b', '#d97706'] },
];

export const topCarsData = [
    { rank: 1, name: 'Mahindra Scorpio', category: 'SUV', bookings: 38, revenue: '₹4,75,000', trend: '+24%' },
    { rank: 2, name: 'Maruti Swift', category: 'Hatchback', bookings: 31, revenue: '₹3,85,000', trend: '+18%' },
    { rank: 3, name: 'Hyundai Verna', category: 'Sedan', bookings: 22, revenue: '₹6,40,000', trend: '+12%' },
    { rank: 4, name: 'Maruti Brezza', category: 'SUV', bookings: 19, revenue: '₹2,85,000', trend: '+8%' },
];

export const recentBookingsData = [
    { name: 'Sarah Johnson', initials: 'SJ', car: 'Maruti Swift · 3 days', time: '2m ago', status: 'confirmed', amount: '₹7,500', color: '#10b981' },
    { name: 'Mike Chen', initials: 'MC', car: 'Hyundai Verna · 1 day', time: '15m ago', status: 'pickup', amount: '₹4,200', color: '#004f8f' },
    { name: 'Priya Sharma', initials: 'PS', car: 'Maruti Brezza · 2 days', time: '1h ago', status: 'returned', amount: '₹7,000', color: '#71717a' },
    { name: 'Alex Rivera', initials: 'AR', car: 'Mahindra Scorpio · 5 days', time: '2h ago', status: 'confirmed', amount: '₹27,500', color: '#10b981' },
];

export const adminBookingsList = [
    { 
        id: '#B9801', 
        client: 'Alice Vance', 
        clientAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        clientPhone: '+91 98765 43210',
        clientEmail: 'alice.vance@company.com',
        clientVerified: true,
        car: {
            name: 'Maruti Suzuki Swift',
            subtitle: 'Premium Urban Hatchback',
            category: 'Hatchback',
            type: 'Economy',
            image: 'https://imgd.aeplcdn.com/664x374/n/ues0egb_1840524.jpg?q=80',
            images: [
                'https://imgd.aeplcdn.com/664x374/n/ues0egb_1840524.jpg?q=80',
                'https://img.gaadicdn.com/editorial/gallery/6620f4f9dbe4f.jpg',
                'https://img.gaadicdn.com/editorial/gallery/6620f4fa9b0e2.jpg'
            ],
            price: 2500,
            plate: 'MH 01 EA 2024',
            odometer: '24,500 km',
            specs: { transmission: 'Manual', fuelLeft: '85% Fuel', drivenKm: '24,500 km', topSpeed: '165 km/h', acceleration: '11.5s', seats: '5' },
            features: ['Air Condition', 'Bluetooth', 'Compact Size', 'USB Charger', 'Keyless Entry'],
            description: 'Enjoy agile handling and excellent fuel efficiency with the Maruti Swift. A compact hatchback perfect for zipping through urban traffic with premium cabin utilities.',
            aiPrediction: {
                level: 'High Demand',
                color: '#db2777',
                bg: '#fdf2f8',
                border: '#fbcfe8',
                tip: 'City commuter bookings are peaking. Maintain 100% availability for weekend getaways.'
            }
        },
        date: 'May 14 - May 18, 2026', 
        durationDays: 4,
        dateRange: 'This Week',
        pickupLocation: 'Downtown Fleet Hub, Bay 02',
        dropoffLocation: 'Downtown Fleet Hub, Bay 02',
        status: 'Approved', 
        statusColor: '#10b981',
        statusBg: '#ecfdf5',
        price: '₹10,000',
        breakdown: {
            baseRate: 10000,
            insurance: 1500,
            tax: 500,
            deposit: 3000,
            total: 15000
        }
    },
    { 
        id: '#B9802', 
        client: 'John Doe', 
        clientAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        clientPhone: '+91 91234 56789',
        clientEmail: 'john.doe@executive.com',
        clientVerified: true,
        car: {
            name: 'Maruti Suzuki Brezza',
            subtitle: 'Compact Smart SUV',
            category: 'SUV',
            type: 'SUV Series',
            image: 'https://i.pinimg.com/736x/5a/9c/1d/5a9c1dde8d4377343b270c59dc068e8f.jpg',
            images: [
                'https://i.pinimg.com/736x/5a/9c/1d/5a9c1dde8d4377343b270c59dc068e8f.jpg',
                'https://imgd.aeplcdn.com/664x374/n/cw/ec/123185/brezza-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80',
                'https://imgd.aeplcdn.com/664x374/n/cw/ec/123185/brezza-exterior-right-rear-three-quarter.jpeg?isig=0&q=80'
            ],
            price: 3500,
            plate: 'DL 04 CA 9981',
            odometer: '18,200 km',
            specs: { transmission: 'Auto', fuelLeft: '45L Gas', drivenKm: '18,200 km', topSpeed: '180 km/h', acceleration: '10.2s', seats: '5' },
            features: ['Sunroof', 'Touchscreen Infotainment', 'Cruise Control', 'Wireless Charging', '360 Camera'],
            description: 'The all-new Maruti Suzuki Brezza brings high-tech features and bold SUV styling. Outstanding ground clearance and an advanced automatic gearbox make it ideal for airport transfers and long road trips.',
            aiPrediction: {
                level: 'Extreme Demand',
                color: '#d97706',
                bg: '#fffbeb',
                border: '#fde68a',
                tip: 'Airport pickups surge expected. Adjust dynamic rate upwards by 10% during peak flights.'
            }
        },
        date: 'May 13 - May 15, 2026', 
        durationDays: 2,
        dateRange: 'Today',
        pickupLocation: 'Airport Terminal Hub',
        dropoffLocation: 'Airport Terminal Hub',
        status: 'Pending', 
        statusColor: '#f59e0b',
        statusBg: '#fffbeb',
        price: '₹7,000',
        breakdown: {
            baseRate: 7000,
            insurance: 1000,
            tax: 350,
            deposit: 5000,
            total: 13350
        }
    },
    { 
        id: '#B9803', 
        client: 'Robert Smith', 
        clientAvatar: 'https://randomuser.me/api/portraits/men/85.jpg',
        clientPhone: '+91 99887 76655',
        clientEmail: 'robert.smith@global.io',
        clientVerified: true,
        car: {
            name: 'Hyundai Verna',
            subtitle: 'Futuristic Turbo Sedan',
            category: 'Sedan',
            type: 'Premium Sedan',
            image: 'https://images.autox.com/uploads/2023/03/Hyundai-Verna-Starry-Night-500x261.jpg',
            images: [
                'https://images.autox.com/uploads/2023/03/Hyundai-Verna-Starry-Night-500x261.jpg',
                'https://cdn-s3.autocarindia.com/legacy/cdni/Galleries/20251207010308_Hyundai_Verna_Atlas_White_Dual_Tone.png?w=728&q=75',
                'https://imgd.aeplcdn.com/664x374/n/cw/ec/121943/verna-exterior-right-front-three-quarter-101.jpeg?isig=0&q=80'
            ],
            price: 4200,
            plate: 'KA 03 HB 4432',
            odometer: '12,400 km',
            specs: { transmission: '7-Speed DCT', fuelLeft: '92% Fuel', drivenKm: '12,400 km', topSpeed: '210 km/h', acceleration: '8.1s', seats: '5' },
            features: ['ADAS Level 2', 'Ventilated Seats', 'Bose Premium Sound', 'Smart Trunk', 'Ambient Lighting'],
            description: 'Spectacular futuristic styling backed by a thrilling 1.5L Turbo engine. The Hyundai Verna delivers executive luxury, ADAS safety, and segment-first comfort amenities.',
            aiPrediction: {
                level: 'Extreme Demand',
                color: '#d97706',
                bg: '#fffbeb',
                border: '#fde68a',
                tip: 'Executive rental inquiries up by 35%. Enable premium chauffeur add-on package.'
            }
        },
        date: 'May 10 - May 12, 2026', 
        durationDays: 2,
        dateRange: 'This Month',
        pickupLocation: 'Uptown Premium Bay',
        dropoffLocation: 'Uptown Premium Bay',
        status: 'Completed', 
        statusColor: '#6366f1',
        statusBg: '#e0e7ff',
        price: '₹8,400',
        breakdown: {
            baseRate: 8400,
            insurance: 1200,
            tax: 420,
            deposit: 5000,
            total: 15020
        }
    },
    { 
        id: '#B9804', 
        client: 'Elena Rostova', 
        clientAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        clientPhone: '+91 97654 32109',
        clientEmail: 'elena@rostovagroup.com',
        clientVerified: true,
        car: {
            name: 'Mahindra Scorpio-N',
            subtitle: 'Big Daddy Power SUV',
            category: 'SUV',
            type: 'Full-size SUV',
            image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/128413/scorpio-exterior-right-front-three-quarter-46.jpeg?isig=0&q=80',
            images: [
                'https://imgd.aeplcdn.com/664x374/n/cw/ec/128413/scorpio-exterior-right-front-three-quarter-46.jpeg?isig=0&q=80',
                'https://imgd.aeplcdn.com/664x374/n/cw/ec/128413/scorpio-exterior-right-rear-three-quarter-47.jpeg?isig=0&q=80',
                'https://imgd.aeplcdn.com/664x374/n/cw/ec/128413/scorpio-dashboard-57.jpeg?isig=0&q=80'
            ],
            price: 5500,
            plate: 'HR 26 EX 1109',
            odometer: '35,100 km',
            specs: { transmission: '6-Speed Auto', fuelLeft: '30L Gas', drivenKm: '35,100 km', topSpeed: '190 km/h', acceleration: '9.8s', seats: '7' },
            features: ['4x4 Terrain Mode', 'Captain Seats', 'Sony 3D Audio', 'Powered Driver Seat', 'Dual Zone AC'],
            description: 'True ladder-frame SUV capability engineered for unmatched road dominance. Commanding driver position, advanced 4x4 modes, and plush 7-seat seating configuration.',
            aiPrediction: {
                level: 'Normal Demand',
                color: '#52525b',
                bg: '#f4f4f5',
                border: '#e4e4e7',
                tip: 'Standard 5,000 km routine service underway. Asset will be back online by 5 PM today.'
            }
        },
        date: 'May 14 - May 16, 2026', 
        durationDays: 2,
        dateRange: 'Today',
        pickupLocation: 'Workshop Hub A',
        dropoffLocation: 'Workshop Hub A',
        status: 'Approved', 
        statusColor: '#10b981',
        statusBg: '#ecfdf5',
        price: '₹11,000',
        breakdown: {
            baseRate: 11000,
            insurance: 2000,
            tax: 550,
            deposit: 5000,
            total: 18550
        }
    },
    { 
        id: '#B9805', 
        client: 'Marcus Brody', 
        clientAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        clientPhone: '+91 98111 22334',
        clientEmail: 'marcus.brody@museum.org',
        clientVerified: false,
        car: {
            name: 'Maruti Suzuki Brezza',
            subtitle: 'Compact Smart SUV',
            category: 'SUV',
            type: 'SUV Series',
            image: 'https://i.pinimg.com/736x/5a/9c/1d/5a9c1dde8d4377343b270c59dc068e8f.jpg',
            images: [
                'https://i.pinimg.com/736x/5a/9c/1d/5a9c1dde8d4377343b270c59dc068e8f.jpg',
                'https://imgd.aeplcdn.com/664x374/n/cw/ec/123185/brezza-exterior-right-front-three-quarter-4.jpeg?isig=0&q=80',
                'https://imgd.aeplcdn.com/664x374/n/cw/ec/123185/brezza-exterior-right-rear-three-quarter.jpeg?isig=0&q=80'
            ],
            price: 3500,
            plate: 'DL 04 CA 9981',
            odometer: '18,200 km',
            specs: { transmission: 'Auto', fuelLeft: '45L Gas', drivenKm: '18,200 km', topSpeed: '180 km/h', acceleration: '10.2s', seats: '5' },
            features: ['Sunroof', 'Touchscreen Infotainment', 'Cruise Control', 'Wireless Charging', '360 Camera'],
            description: 'The all-new Maruti Suzuki Brezza brings high-tech features and bold SUV styling. Outstanding ground clearance and an advanced automatic gearbox make it ideal for airport transfers and long road trips.',
            aiPrediction: {
                level: 'Extreme Demand',
                color: '#d97706',
                bg: '#fffbeb',
                border: '#fde68a',
                tip: 'Airport pickups surge expected. Adjust dynamic rate upwards by 10% during peak flights.'
            }
        },
        date: 'May 16 - May 19, 2026', 
        durationDays: 3,
        dateRange: 'This Week',
        pickupLocation: 'Airport Terminal Hub',
        dropoffLocation: 'Airport Terminal Hub',
        status: 'Approved', 
        statusColor: '#10b981',
        statusBg: '#ecfdf5',
        price: '₹10,500',
        breakdown: {
            baseRate: 10500,
            insurance: 1500,
            tax: 525,
            deposit: 5000,
            total: 17525
        }
    },
    { 
        id: '#B9806', 
        client: 'Christian Bale', 
        clientAvatar: 'https://randomuser.me/api/portraits/men/50.jpg',
        clientPhone: '+91 93210 54321',
        clientEmail: 'cbale@gotham.enterprises',
        clientVerified: true,
        car: {
            name: 'Hyundai Verna',
            subtitle: 'Futuristic Turbo Sedan',
            category: 'Sedan',
            type: 'Premium Sedan',
            image: 'https://images.autox.com/uploads/2023/03/Hyundai-Verna-Starry-Night-500x261.jpg',
            images: [
                'https://images.autox.com/uploads/2023/03/Hyundai-Verna-Starry-Night-500x261.jpg',
                'https://cdn-s3.autocarindia.com/legacy/cdni/Galleries/20251207010308_Hyundai_Verna_Atlas_White_Dual_Tone.png?w=728&q=75',
                'https://imgd.aeplcdn.com/664x374/n/cw/ec/121943/verna-exterior-right-front-three-quarter-101.jpeg?isig=0&q=80'
            ],
            price: 4200,
            plate: 'KA 03 HB 4432',
            odometer: '12,400 km',
            specs: { transmission: '7-Speed DCT', fuelLeft: '92% Fuel', drivenKm: '12,400 km', topSpeed: '210 km/h', acceleration: '8.1s', seats: '5' },
            features: ['ADAS Level 2', 'Ventilated Seats', 'Bose Premium Sound', 'Smart Trunk', 'Ambient Lighting'],
            description: 'Spectacular futuristic styling backed by a thrilling 1.5L Turbo engine. The Hyundai Verna delivers executive luxury, ADAS safety, and segment-first comfort amenities.',
            aiPrediction: {
                level: 'Extreme Demand',
                color: '#d97706',
                bg: '#fffbeb',
                border: '#fde68a',
                tip: 'Executive rental inquiries up by 35%. Enable premium chauffeur add-on package.'
            }
        },
        date: 'May 20 - May 24, 2026', 
        durationDays: 4,
        dateRange: 'This Month',
        pickupLocation: 'Uptown Premium Bay',
        dropoffLocation: 'Uptown Premium Bay',
        status: 'Pending', 
        statusColor: '#f59e0b',
        statusBg: '#fffbeb',
        price: '₹16,800',
        breakdown: {
            baseRate: 16800,
            insurance: 2000,
            tax: 840,
            deposit: 5000,
            total: 24640
        }
    }
];

export const alertsData = [
    {
        icon: 'warning',
        iconColor: '#d97706',
        iconBg: '#fef3c7',
        bg: '#fffbeb',
        border: '#fde68a',
        title: 'Low SUV Availability',
        desc: 'Only 3 SUVs left for this weekend',
        cta: 'Manage Fleet',
    },
    {
        icon: 'flame',
        iconColor: '#dc2626',
        iconBg: '#fee2e2',
        bg: '#fef2f2',
        border: '#fecaca',
        title: 'High Demand Spike',
        desc: 'Hatchback searches up 40% in last 24 hours',
        cta: 'Adjust Pricing',
    },
];

// ── Revenue Screen Data ────────────────────────────────────────────────
export const revenueWeeklyData = [120000, 210000, 180000, 310000, 280000, 420000, 350000];
export const revenueWeeklyLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const dailyRevenueData = [
    { day: 'Mon', revenue: '₹1,20,000', pct: 40 },
    { day: 'Tue', revenue: '₹2,10,000', pct: 70 },
    { day: 'Wed', revenue: '₹1,80,000', pct: 60 },
    { day: 'Thu', revenue: '₹3,10,000', pct: 90 },
    { day: 'Fri', revenue: '₹2,80,000', pct: 85 },
    { day: 'Sat', revenue: '₹4,20,000', pct: 100 },
    { day: 'Sun', revenue: '₹3,50,000', pct: 80 }
];

export const demographicsData = [
    { label: 'Ages 18-25 (Tech-Savvy)', percentage: 35, color: '#3b82f6' },
    { label: 'Ages 26-40 (Business & Executive)', percentage: 50, color: '#10b981' },
    { label: 'Ages 41+ (Luxury Enthusiasts)', percentage: 15, color: '#eab308' }
];
