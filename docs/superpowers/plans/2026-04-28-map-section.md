# Map Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a Map View / List View toggle to the job feed screen with accent-colored pins and a callout on tap.

**Architecture:** All changes live in `client/app/(tabs)/index.jsx`. A `viewMode` state switches between the existing FlatList and a react-native-maps MapView. Hardcoded lat/lng coordinates are added to each mock job.

**Tech Stack:** React Native, Expo SDK 55, react-native-maps, expo-router

---

## File Map

- Modify: `client/app/(tabs)/index.jsx` - add coords to MOCK_JOBS, viewMode state, toggle button, MapView with Markers/Callouts

---

### Task 1: Install react-native-maps

- [ ] **Step 1:** Run from the client directory:

```bash
cd client && npx expo install react-native-maps
```

Expected: react-native-maps added to package.json.

- [ ] **Step 2:** Verify:

```bash
grep react-native-maps client/package.json
```

- [ ] **Step 3:** Commit:

```bash
git add client/package.json client/package-lock.json
git commit -m "deps: install react-native-maps"
```

---

### Task 2: Add coordinates to MOCK_JOBS

**File:** `client/app/(tabs)/index.jsx` (MOCK_JOBS array, lines 26-98)

- [ ] **Step 1:** Add a `coords` field to each mock job after the `location` field:

```js
// id 1  Lahug:    coords: { latitude: 10.3310, longitude: 123.9137 },
// id 2  Banilad:  coords: { latitude: 10.3500, longitude: 123.9050 },
// id 3  IT Park:  coords: { latitude: 10.3310, longitude: 123.9053 },
// id 4  Talamban: coords: { latitude: 10.3600, longitude: 123.9200 },
// id 5  Mabolo:   coords: { latitude: 10.3230, longitude: 123.9180 },
// id 6  Downtown: coords: { latitude: 10.2939, longitude: 123.9020 },
```

- [ ] **Step 2:** Commit:

```bash
git add client/app/(tabs)/index.jsx
git commit -m "feat: add lat/lng coords to mock jobs"
```

---

### Task 3: Add viewMode state, toggle button, and new styles

**File:** `client/app/(tabs)/index.jsx`

- [ ] **Step 1:** Add MapView import after the existing import block (after line 11):

```js
import MapView, { Marker, Callout } from "react-native-maps";
```

- [ ] **Step 2:** Add viewMode state inside JobFeed after existing useState calls (~line 182):

```js
const [viewMode, setViewMode] = useState("list");
```

- [ ] **Step 3:** Add these entries to StyleSheet.create({}):

```js
headerActions: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
toggleBtn: {
  backgroundColor: Colors.surfaceRaised, paddingHorizontal: 14, paddingVertical: 6,
  borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border,
},
toggleBtnText: { fontSize: 14, fontWeight: "700", color: Colors.textSecondary },
map: { flex: 1 },
callout: { width: 200, padding: 8 },
calloutTitle: { fontSize: 13, fontWeight: "700", color: "#111", marginBottom: 2 },
calloutPay: { fontSize: 13, fontWeight: "900", color: "#C47D0E" },
calloutBtn: { marginTop: 4, fontSize: 12, fontWeight: "700", color: "#F5A623", textDecorationLine: "underline" },
```

- [ ] **Step 4:** Commit:

```bash
git add client/app/(tabs)/index.jsx
git commit -m "feat: add viewMode state and map/callout styles"
```

---

### Task 4: Replace return statement with toggled Map/List views

**File:** `client/app/(tabs)/index.jsx`

- [ ] **Step 1:** Delete the `const Header = (...)` block (lines ~195-230) -- it is no longer used.

- [ ] **Step 2:** Replace the entire `return (...)` in JobFeed with the following (header is now inline so it stays visible in both modes):

```jsx
return (
  <SafeAreaView style={styles.safe}>
    <View style={styles.headerBg}>
      <View style={styles.header}>
        <Text style={styles.title}>Find a Quest</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => setViewMode(viewMode === "list" ? "map" : "list")}
          >
            <Text style={styles.toggleBtnText}>
              {viewMode === "list" ? "MAP" : "LIST"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postBtn} onPress={() => router.push("/job/create")}>
            <Text style={styles.postText}>+ Post</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SearchBar value={search} onChangeText={setSearch} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <CategoryPill key={cat.id} label={cat.label} active={activeCategory === cat.id}
            onPress={() => setActiveCategory(cat.id)} />
        ))}
      </ScrollView>
      <Text style={styles.results}>
        {filtered.length} quest{filtered.length !== 1 ? "s" : ""} found
      </Text>
    </View>

    {viewMode === "list" ? (
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <JobCard job={item} onPress={() => router.push("../job/" + item.id)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    ) : (
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 10.3310, longitude: 123.9137, latitudeDelta: 0.12, longitudeDelta: 0.12 }}
      >
        {filtered.map((job) => (
          <Marker key={job.id} coordinate={job.coords} pinColor="#F5A623">
            <Callout onPress={() => router.push("../job/" + job.id)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{job.title}</Text>
                <Text style={styles.calloutPay}>P{job.pay}</Text>
                <Text style={styles.calloutBtn}>View Quest</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    )}
  </SafeAreaView>
);
```

- [ ] **Step 3:** Run `cd client && npx expo start` and confirm:
  1. Feed loads in list mode (same as before)
  2. Tapping MAP switches to map view with amber pins over Cebu City
  3. Tapping a pin shows callout: title, pay, View Quest link
  4. Tapping View Quest navigates to job detail screen
  5. Tapping LIST returns to card list
  6. Category/search filters update which pins appear in map mode

- [ ] **Step 4:** Commit:

```bash
git add client/app/(tabs)/index.jsx
git commit -m "feat: map view with filtered pins and callouts on job feed"
```