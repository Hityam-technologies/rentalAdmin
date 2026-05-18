import {
    heroData,
    dashboardStats,
    fleetSegments,
    topCarsData,
    aiInsightsData,
    adminBookingsList,
    inventoryList,
} from '../constants/data';
import { mockClients, mockStaff } from '../constants/peopleData';

const uid = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const ASSISTANT_NAME = 'Hityam AI';
export const ASSISTANT_TAGLINE = 'Your fleet operations co-pilot';

export const SUGGESTED_PROMPTS = [
    "How's revenue today?",
    'Fleet utilization summary',
    'Show pending bookings',
    'Take me to add a new car',
    'Top performing vehicles',
    'Navigate to People & Team',
];

export const INITIAL_MESSAGES = [
    {
        id: 'welcome',
        role: 'assistant',
        text: `Hi — I'm ${ASSISTANT_NAME}, your personal admin assistant. I can analyze fleet, bookings, revenue, and team data, navigate you anywhere in the app, and help with updates (I'll always ask before making changes).`,
        createdAt: Date.now(),
        actions: [
            { id: 'nav-fleet', label: 'Open Fleet', icon: 'car-sport', navigate: { screen: 'MainTabs', params: { screen: 'Fleet' } } },
            { id: 'nav-bookings', label: 'Bookings', icon: 'ticket', navigate: { screen: 'MainTabs', params: { screen: 'Bookings' } } },
        ],
    },
];

function normalize(text) {
    return (text || '').toLowerCase().trim();
}

function includesAny(text, words) {
    return words.some((w) => text.includes(w));
}

function countBookingsByStatus() {
    const counts = { Approved: 0, Pending: 0, Completed: 0, other: 0 };
    adminBookingsList.forEach((b) => {
        const s = b.status || 'other';
        if (counts[s] !== undefined) counts[s] += 1;
        else counts.other += 1;
    });
    return counts;
}

function fleetBreakdown() {
    const available = inventoryList.filter((c) => c.status === 'Available').length;
    const onRent = inventoryList.filter((c) => c.status === 'On Rent').length;
    const inService = inventoryList.filter((c) => c.status === 'In Service').length;
    return { available, onRent, inService, total: inventoryList.length };
}

function findCarByQuery(text) {
    return inventoryList.find((c) => {
        const name = c.name.toLowerCase();
        const tokens = name.split(/\s+/);
        return tokens.some((t) => t.length > 3 && text.includes(t)) || text.includes(name.split(' ').pop());
    });
}

function findBookingByQuery(text) {
    return adminBookingsList.find(
        (b) =>
            text.includes(b.id.toLowerCase()) ||
            b.client.toLowerCase().split(' ').some((p) => p.length > 2 && text.includes(p)),
    );
}

/** Build assistant message object */
function assistantReply(text, extras = {}) {
    return {
        id: uid(),
        role: 'assistant',
        text,
        createdAt: Date.now(),
        ...extras,
    };
}

function userEcho(text) {
    return {
        id: uid(),
        role: 'user',
        text,
        createdAt: Date.now(),
    };
}

// ── Intent handlers ───────────────────────────────────────────────────

function handleNavigation(text) {
    const navPatterns = [
        {
            match: () => includesAny(text, ['add car', 'new car', 'register car']),
            screen: 'AddCar',
            label: 'Add Car',
            reply: 'Opening the Add Car form so you can register a new vehicle with photos, pricing, and documents.',
        },
        {
            match: () => includesAny(text, ['add worker', 'hire staff', 'new worker', 'add staff', 'new employee']),
            screen: 'AddWorker',
            label: 'Add Worker',
            reply: 'Taking you to Add Worker — you can set role, payroll, and contact details.',
        },
        {
            match: () => includesAny(text, ['notification', 'alert']),
            screen: 'Notifications',
            label: 'Notifications',
            reply: 'Here are your latest fleet alerts and system notifications.',
        },
        {
            match: () => includesAny(text, ['setting', 'profile', 'account']),
            screen: 'Settings',
            label: 'Settings',
            reply: 'Opening Settings for account and app preferences.',
        },
        {
            match: () => includesAny(text, ['fleet', 'cars', 'vehicle', 'inventory', 'garage']),
            screen: 'MainTabs',
            params: { screen: 'Fleet' },
            label: 'Fleet',
            reply: 'Opening your fleet inventory — filter by Available, On Rent, or In Service.',
        },
        {
            match: () => includesAny(text, ['booking', 'reservation', 'rental']),
            screen: 'MainTabs',
            params: { screen: 'Bookings' },
            label: 'Bookings',
            reply: 'Opening Bookings — review approvals, pickups, and returns.',
        },
        {
            match: () => includesAny(text, ['revenue', 'earning', 'finance', 'money', 'sales']),
            screen: 'MainTabs',
            params: { screen: 'Revenue' },
            label: 'Revenue',
            reply: 'Opening Revenue analytics with daily targets and trends.',
        },
        {
            match: () =>
                includesAny(text, ['people', 'team', 'client', 'customer', 'worker', 'staff', 'hr']),
            screen: 'MainTabs',
            params: { screen: 'People' },
            label: 'People & Team',
            reply: 'Opening People & Team — manage VIP clients and field staff.',
        },
        {
            match: () => includesAny(text, ['home', 'dashboard', 'overview']),
            screen: 'MainTabs',
            params: { screen: 'Home' },
            label: 'Dashboard',
            reply: 'Back to your command center — live KPIs and AI insights.',
        },
    ];

    const wantsNav = includesAny(text, [
        'go to',
        'open',
        'show me',
        'navigate',
        'take me',
        'bring me',
        'switch to',
        'visit',
    ]);

    for (const p of navPatterns) {
        if (p.match() && (wantsNav || text.length < 40)) {
            return assistantReply(p.reply, {
                actions: [
                    {
                        id: `go-${p.label}`,
                        label: `Go to ${p.label}`,
                        icon: 'arrow-forward',
                        navigate: { screen: p.screen, params: p.params },
                    },
                ],
                autoNavigate: { screen: p.screen, params: p.params, delayMs: 800 },
            });
        }
    }

    if (wantsNav) {
        return assistantReply(
            'I can take you to Dashboard, Fleet, Bookings, Revenue, People, Notifications, Settings, Add Car, or Add Worker. Which one?',
            {
                actions: [
                    { id: 'n1', label: 'Fleet', icon: 'car-sport', navigate: { screen: 'MainTabs', params: { screen: 'Fleet' } } },
                    { id: 'n2', label: 'Bookings', icon: 'ticket', navigate: { screen: 'MainTabs', params: { screen: 'Bookings' } } },
                    { id: 'n3', label: 'Revenue', icon: 'analytics', navigate: { screen: 'MainTabs', params: { screen: 'Revenue' } } },
                ],
            },
        );
    }
    return null;
}

function handleAnalysis(text) {
    if (includesAny(text, ['revenue', 'earning', 'sales', 'income', 'money made'])) {
        const stats = dashboardStats.find((s) => s.label === 'On Rent');
        return assistantReply(
            `Today's revenue is ${heroData.todayRevenue} (${heroData.deltaPct} vs yesterday). You have ${heroData.bookingsToday} bookings today (${heroData.bookingsDelta}). Fleet utilization is ${heroData.utilizationPct}% (${heroData.utilOf} vehicles active).`,
            {
                metrics: [
                    { label: 'Today', value: heroData.todayRevenue, sub: heroData.deltaPct },
                    { label: 'Bookings', value: String(heroData.bookingsToday), sub: heroData.bookingsDelta },
                    { label: 'Utilization', value: `${heroData.utilizationPct}%`, sub: heroData.utilOf },
                ],
                actions: [
                    {
                        id: 'rev-detail',
                        label: 'Full revenue report',
                        icon: 'analytics',
                        navigate: { screen: 'MainTabs', params: { screen: 'Revenue' } },
                    },
                ],
            },
        );
    }

    if (includesAny(text, ['utilization', 'fleet status', 'how many car', 'available car', 'fleet summary', 'inventory status'])) {
        const fb = fleetBreakdown();
        const seg = fleetSegments.map((s) => `${s.label}: ${s.value}`).join(' · ');
        return assistantReply(
            `Fleet overview — ${fb.total} vehicles in catalog. Available: ${fb.available}, On Rent: ${fb.onRent}, In Service: ${fb.inService}. Dashboard snapshot: ${seg}.`,
            {
                metrics: dashboardStats.map((s) => ({ label: s.label, value: s.value, sub: s.sub })),
                actions: [
                    {
                        id: 'fleet-open',
                        label: 'View fleet',
                        icon: 'car-sport',
                        navigate: { screen: 'MainTabs', params: { screen: 'Fleet' } },
                    },
                ],
            },
        );
    }

    if (includesAny(text, ['booking', 'reservation', 'pending', 'approval'])) {
        const counts = countBookingsByStatus();
        const pending = adminBookingsList.filter((b) => b.status === 'Pending' || b.status === 'Awaiting');
        const lines = adminBookingsList.slice(0, 3).map((b) => `• ${b.id} — ${b.client} (${b.car?.name || 'Vehicle'}) — ${b.status}`).join('\n');
        return assistantReply(
            `${adminBookingsList.length} active bookings in system. Approved: ${counts.Approved}. Recent:\n${lines}${pending.length ? `\n\n${pending.length} item(s) may need your review.` : ''}`,
            {
                actions: [
                    {
                        id: 'book-open',
                        label: 'Open bookings',
                        icon: 'ticket',
                        navigate: { screen: 'MainTabs', params: { screen: 'Bookings' } },
                    },
                ],
            },
        );
    }

    if (includesAny(text, ['top car', 'best car', 'performing', 'popular vehicle', 'highest revenue car'])) {
        const lines = topCarsData.map((c) => `${c.rank}. ${c.name} (${c.category}) — ${c.bookings} bookings, ${c.revenue} (${c.trend})`).join('\n');
        return assistantReply(`Top performers this period:\n${lines}`, {
            metrics: topCarsData.slice(0, 3).map((c) => ({
                label: `#${c.rank} ${c.category}`,
                value: c.revenue,
                sub: `${c.bookings} bookings · ${c.trend}`,
            })),
        });
    }

    if (includesAny(text, ['client', 'customer', 'vip'])) {
        const totalRev = mockClients.reduce((s, c) => s + (c.totalRevenue || 0), 0);
        return assistantReply(
            `${mockClients.length} VIP clients on file. Combined lifetime revenue: ₹${(totalRev / 1000).toFixed(0)}K+. Top: ${mockClients[0]?.name} (${mockClients[0]?.tier}) with ${mockClients[0]?.totalBookings} bookings.`,
            {
                actions: [
                    {
                        id: 'people-clients',
                        label: 'View clients',
                        icon: 'people',
                        navigate: { screen: 'MainTabs', params: { screen: 'People' } },
                    },
                ],
            },
        );
    }

    if (includesAny(text, ['worker', 'staff', 'team size', 'employee', 'payroll'])) {
        return assistantReply(
            `${mockStaff.length} team members in roster — drivers, mechanics, and hub staff. Open People → Workers to see schedules, roles, and payroll overview.`,
            {
                actions: [
                    {
                        id: 'people-workers',
                        label: 'View workers',
                        icon: 'construct',
                        navigate: { screen: 'MainTabs', params: { screen: 'People' } },
                    },
                ],
            },
        );
    }

    if (includesAny(text, ['insight', 'recommend', 'tip', 'ai suggest', 'co-pilot', 'advice'])) {
        const tips = aiInsightsData.map((i) => `• ${i.label}: ${i.value} — ${i.sub} (${i.confidence}% confidence)`).join('\n');
        return assistantReply(`Current AI recommendations:\n${tips}`);
    }

    if (includesAny(text, ['help', 'what can you', 'how do you work', 'commands'])) {
        return assistantReply(
            'I can:\n\n1. Analyze — revenue, fleet, bookings, clients, workers, trends\n2. Navigate — any tab or screen (e.g. "open fleet")\n3. Act — status updates, approvals, pricing (always with confirmation)\n\nTry: "How\'s revenue today?" or "Mark Swift as available"',
        );
    }

    return null;
}

function handleActions(text) {
    const car = findCarByQuery(text);
    const booking = findBookingByQuery(text);

    if (includesAny(text, ['mark', 'set', 'update', 'change']) && includesAny(text, ['available', 'on rent', 'in service', 'status'])) {
        const target = car || inventoryList[0];
        let newStatus = 'Available';
        if (text.includes('on rent') || text.includes('rented')) newStatus = 'On Rent';
        if (text.includes('service') || text.includes('maintenance')) newStatus = 'In Service';

        return assistantReply(
            `I can update ${target.name} to status "${newStatus}". This affects live availability and customer bookings.`,
            {
                permission: {
                    title: 'Confirm fleet update',
                    body: `Change ${target.name} → ${newStatus}?`,
                    confirmLabel: 'Yes, update status',
                    cancelLabel: 'Cancel',
                    actionType: 'UPDATE_CAR_STATUS',
                    payload: { carId: target.id, carName: target.name, newStatus },
                },
            },
        );
    }

    if (includesAny(text, ['approve', 'confirm booking', 'accept booking'])) {
        const b = booking || adminBookingsList.find((x) => x.status === 'Pending') || adminBookingsList[0];
        return assistantReply(
            `Ready to approve booking ${b.id} for ${b.client} (${b.car?.name || 'vehicle'}, ${b.price}).`,
            {
                permission: {
                    title: 'Approve booking',
                    body: `Approve ${b.id} — ${b.client}? Total ${b.price}.`,
                    confirmLabel: 'Approve booking',
                    cancelLabel: 'Not now',
                    actionType: 'APPROVE_BOOKING',
                    payload: { bookingId: b.id, client: b.client },
                },
            },
        );
    }

    if (includesAny(text, ['raise price', 'increase rate', 'pricing', 'apply 5%'])) {
        const insight = aiInsightsData.find((i) => i.label === 'Pricing Tip');
        return assistantReply(
            insight
                ? `Pricing insight: ${insight.value} — ${insight.sub}. Applying this updates rates across matching segments.`
                : 'I can apply a fleet-wide or segment price adjustment.',
            {
                permission: {
                    title: 'Apply pricing change',
                    body: 'Apply +5% rate adjustment to high-demand economy segment for this week?',
                    confirmLabel: 'Apply pricing',
                    cancelLabel: 'Cancel',
                    actionType: 'APPLY_PRICING',
                    payload: { percent: 5, segment: 'Economy' },
                },
            },
        );
    }

    if (includesAny(text, ['notify', 'send alert', 'remind team'])) {
        return assistantReply('I can queue an internal alert for your operations team.', {
            permission: {
                title: 'Send team alert',
                body: 'Send "High weekend demand — ensure all returns processed by 6 PM" to hub staff?',
                confirmLabel: 'Send alert',
                cancelLabel: 'Cancel',
                actionType: 'SEND_ALERT',
                payload: { message: 'High weekend demand — ensure all returns processed by 6 PM' },
            },
        });
    }

    return null;
}

/**
 * Process user text → { userMessage, assistantMessage }
 */
export function processUserMessage(inputText) {
    const text = normalize(inputText);
    if (!text) {
        return {
            userMessage: null,
            assistantMessage: assistantReply('Type a question or command — I\'m listening.'),
        };
    }

    const userMessage = userEcho(inputText);

    const handlers = [handleNavigation, handleAnalysis, handleActions];
    for (const fn of handlers) {
        const result = fn(text);
        if (result) {
            return { userMessage, assistantMessage: result };
        }
    }

    if (text.includes('hello') || text.includes('hi ') || text === 'hi') {
        return {
            userMessage,
            assistantMessage: assistantReply(
                `Hello! ${ASSISTANT_NAME} here. Ask me about revenue, fleet, or say "open bookings" to navigate.`,
            ),
        };
    }

    return {
        userMessage,
        assistantMessage: assistantReply(
            "I'm not sure I caught that. I work best with questions like \"today's revenue\", \"fleet utilization\", or \"take me to settings\". Want a quick tour?",
            {
                actions: [
                    { id: 'h1', label: 'Revenue today', icon: 'cash', navigate: null, prompt: "How's revenue today?" },
                    { id: 'h2', label: 'Fleet summary', icon: 'car-sport', navigate: null, prompt: 'Fleet utilization summary' },
                    { id: 'h3', label: 'Open dashboard', icon: 'home', navigate: { screen: 'MainTabs', params: { screen: 'Home' } } },
                ],
            },
        ),
    };
}

/** Run confirmed action — returns follow-up assistant message */
export function executeConfirmedAction(actionType, payload) {
    switch (actionType) {
        case 'UPDATE_CAR_STATUS':
            return assistantReply(
                `Done — ${payload.carName} is now marked "${payload.newStatus}" in the operations log. Sync with your backend API in production; open Fleet to verify.`,
                {
                    actions: [
                        {
                            id: 'view-fleet',
                            label: 'View in Fleet',
                            icon: 'car-sport',
                            navigate: { screen: 'MainTabs', params: { screen: 'Fleet' } },
                        },
                    ],
                },
            );
        case 'APPROVE_BOOKING':
            return assistantReply(
                `Booking ${payload.bookingId} for ${payload.client} has been approved. Customer will receive confirmation. Check Bookings for pickup details.`,
                {
                    actions: [
                        {
                            id: 'view-booking',
                            label: 'Open bookings',
                            icon: 'ticket',
                            navigate: { screen: 'MainTabs', params: { screen: 'Bookings' } },
                        },
                    ],
                },
            );
        case 'APPLY_PRICING':
            return assistantReply(
                `Applied +${payload.percent}% to ${payload.segment} segment for this week. Estimated uplift aligns with co-pilot forecast (~₹12,400). Monitor conversion in Revenue tab.`,
            );
        case 'SEND_ALERT':
            return assistantReply(
                `Alert sent to hub staff: "${payload.message}". You'll see it in Notifications.`,
                {
                    actions: [
                        {
                            id: 'notif',
                            label: 'Notifications',
                            icon: 'notifications',
                            navigate: { screen: 'Notifications' },
                        },
                    ],
                },
            );
        default:
            return assistantReply('Action completed.');
    }
}
