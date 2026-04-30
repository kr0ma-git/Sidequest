# Map Section Design

**Date:** 2026-04-28
**Feature:** Map View toggle on the job feed screen
**File affected:** client/app/(tabs)/index.jsx

---

## Overview

Add a Map View / List View toggle to the Find a Quest feed screen. Users can switch between the existing card list and a map showing pins for all currently filtered listings. Tapping a pin shows a callout with the job title, pay, and a button to navigate to the job detail page.

---

## Architecture

All changes are scoped to client/app/(tabs)/index.jsx. No new files or routes are needed.

New dependency: react-native-maps, installed via npx expo install react-native-maps.

New state: viewMode (list or map) controls which view renders below the sticky header.

---

## Data

Each job in MOCK_JOBS gains a coords field with hardcoded lat/lng:

| Location            | Latitude  | Longitude  |
|---------------------|-----------|------------|
| Lahug, Cebu City    | 10.3310   | 123.9137   |
| Banilad, Cebu City  | 10.3500   | 123.9050   |
| IT Park, Cebu City  | 10.3310   | 123.9053   |
| Talamban, Cebu City | 10.3600   | 123.9200   |
| Mabolo, Cebu City   | 10.3230   | 123.9180   |
| Downtown, Cebu City | 10.2939   | 123.9020   |

No geocoding API is required.

---

## UI Layout

### Header

A toggle icon button is added to the header row alongside the existing Post button. Shows a map icon in list mode and a list icon in map mode.

### Sticky Header

Search bar, category filter pills, and results count remain visible and functional in both views. Filtering applies to both views.

### List View

FlatList renders JobCard components as before. No changes to existing list behavior.

### Map View

MapView from react-native-maps replaces the FlatList when viewMode is map. It fills all remaining screen space below the sticky header, is centered on Cebu City, and renders one Marker per filtered job.

---

## Map Markers

Each Marker uses pinColor #F5A623 to match the app accent color and has a Callout showing the job title, pay amount, and a View Quest button that navigates to the job detail page.

---

## Out of Scope

- Real geocoding of location strings
- Clustering of overlapping pins
- User current location or GPS
- Dark mode map tiles
