# Progress: HydroSense Hub

## What Works
- [x] Main Dashboard with real-time stats (mocked).
- [x] Watering Zones list view.
- [x] Zone Detail view with sensor charts.
- [x] AI Thirst Index explanation flow.
- [x] AI Weekly Irrigation Summary flow.
- [x] System Analytics page.
- [x] Dark Mode toggle in Settings.
- [x] Responsive Sidebar navigation.

## Left to Build
- [ ] Real-time Firebase Firestore integration.
- [ ] User Authentication (Login/Profile).
- [ ] Create/Edit Schedule forms.
- [ ] Actual Hardware Gateway communication (ESP32 simulation).
- [ ] Notification system for high-severity alerts.

## Known Issues
- `src/lib/mock-data.ts` is currently the source of truth; needs transition to persistent DB.
- Recharts may require careful hydration handling in some environments.
