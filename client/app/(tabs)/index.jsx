import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  FlatList,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, FontSizes, Spacing, Radius } from "../constants/theme";
import { WebView } from "react-native-webview";


function buildMapHTML(jobs) {
  var data = jobs.map(function(j) {
    return { id: j.id, title: j.title, pay: j.pay, lat: j.coords.latitude, lng: j.coords.longitude };
  });
  var jj = JSON.stringify(data);
  var h = "<!DOCTYPE html><html><head>";
  h += "<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">";
  h += "<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />";
  h += "<scr"+"ipt src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></scr"+"ipt>";
  h += "<style>*{margin:0;padding:0;box-sizing:border-box}#map{width:100vw;height:100vh}";
  h += ".pt{font-weight:700;font-size:13px;margin-bottom:2px}";
  h += ".pp{font-weight:900;font-size:13px;color:#C47D0E;margin-bottom:6px}";
  h += ".pb{background:#F5A623;border:none;padding:6px 0;border-radius:6px;color:#fff;font-weight:700;font-size:12px;cursor:pointer;width:100%}";
  h += "</style></head><body><div id="map"></div><scr"+"ipt>";
  h += "document.addEventListener("click",function(e){if(e.target.dataset.jid)window.ReactNativeWebView.postMessage(e.target.dataset.jid);});";
  h += "var map=L.map("map").setView([10.3310,123.9137],13);";
  h += "L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OSM",maxZoom:19}).addTo(map);";
  h += "var icon=L.divIcon({html:"<div style=\"background:#F5A623;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.5)\"></div>",iconSize:[18,18],iconAnchor:[9,9],className:""});";
  h += "var jobs="+jj+";";
  h += "jobs.forEach(function(j){";
  h += "var pop=L.popup({minWidth:160}).setContent(";
  h += ""<div class=\"pt\">"+j.title+"</div>"";
  h += "+"<div class=\"pp\">₱"+j.pay+"</div>"";
  h += "+"<button class=\"pb\" data-jid=\""+j.id+"\">View Quest</button>"";
  h += ");";
  h += "L.marker([j.lat,j.lng],{icon:icon}).addTo(map).bindPopup(pop);});";
  h += "</scr"+"ipt></body></html>";
  return h;
}

function buildMapHTML(jobs) {
  var jj = JSON.stringify(jobs.map(function(j) {
    return { id: j.id, title: j.title, pay: j.pay, lat: j.coords.latitude, lng: j.coords.longitude };
  }));
  var p = [];
  p.push('<!DOCTYPE html><html><head>');
  p.push('<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">');
  p.push('<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>');
  p.push('<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>');
  p.push('<style>*{margin:0;padding:0;box-sizing:border-box}#map{width:100vw;height:100vh}');
  p.push('.pt{font-weight:700;font-size:13px;margin-bottom:2px}');
  p.push('.pp{font-weight:900;font-size:13px;color:#C47D0E;margin-bottom:6px}');
  p.push('.pb{background:#F5A623;border:none;padding:6px 0;border-radius:6px;color:#fff;font-weight:700;font-size:12px;cursor:pointer;width:100%}');
  p.push('</style></head><body><div id="map"></div>');
  p.push('<script>');
  p.push('document.addEventListener("click",function(e){if(e.target.dataset.jid)window.ReactNativeWebView.postMessage(e.target.dataset.jid);});');
  p.push('var map=L.map("map").setView([10.3310,123.9137],13);');
  p.push('L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"© OSM",maxZoom:19}).addTo(map);');
  p.push('var icon=L.divIcon({html:"<div style=\"background:#F5A623;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.5)\"></div>",iconSize:[18,18],iconAnchor:[9,9],className:""});');
  p.push('var jobs='+jj+';');
  p.push('jobs.forEach(function(j){');
  p.push('  var html=',
    '    "<div class=\"pt\">" + j.title + "</div>"',
    '    + "<div class=\"pp\">₱" + j.pay + "</div>"',
    '    + "<button class=\"pb\" data-jid=\"" + j.id + "\">View Quest</button>";');
  p.push('  L.marker([j.lat,j.lng],{icon:icon}).addTo(map).bindPopup(L.popup({minWidth:160}).setContent(html));});');
  p.push('</script></body></html>');
  return p.join('');
}
const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "delivery", label: "🛵 Delivery" },
  { id: "cleaning", label: "🧹 Cleaning" },
  { id: "repair", label: "🔧 Repair" },
  { id: "moving", label: "📦 Moving" },
  { id: "tutoring", label: "📚 Tutoring" },
  { id: "errands", label: "🏃 Errands" },
  { id: "other", label: "✨ Other" },
];

const MOCK_JOBS = [
  {
    id: "1",
    title: "Deliver groceries to Lahug",
    category: "delivery",
    pay: 150,
    location: "Lahug, Cebu City",
    coords: { latitude: 10.3310, longitude: 123.9137 },
    description: "Need someone to pick up groceries from SM Cebu and deliver to my condo. Items are already listed and paid for via GCash.",
    postedBy: "Maria S.",
    postedAt: "2h ago",
    expiresIn: "70h",
    urgent: false,
  },
  {
    id: "2",
    title: "Fix leaking faucet in kitchen",
    category: "repair",
    pay: 300,
    location: "Banilad, Cebu City",
    coords: { latitude: 10.3500, longitude: 123.9050 },
    description: "Kitchen faucet has been dripping for a week. Need someone with basic plumbing experience. Tools preferred but not required.",
    postedBy: "Jun R.",
    postedAt: "30m ago",
    expiresIn: "71h",
    urgent: true,
  },
  {
    id: "3",
    title: "Help move furniture to 2nd floor",
    category: "moving",
    pay: 500,
    location: "IT Park, Cebu City",
    coords: { latitude: 10.3310, longitude: 123.9053 },
    description: "Moving a sofa, dining table, and 2 cabinets from ground floor to second floor. Need 2 strong helpers for about 2 hours.",
    postedBy: "Carla M.",
    postedAt: "5h ago",
    expiresIn: "67h",
    urgent: false,
  },
  {
    id: "4",
    title: "Math tutor for Grade 10 student",
    category: "tutoring",
    pay: 250,
    location: "Talamban, Cebu City",
    coords: { latitude: 10.3600, longitude: 123.9200 },
    description: "My daughter needs help with Algebra and Geometry. 2-hour session this Saturday afternoon. Must be patient and explain clearly.",
    postedBy: "Lito D.",
    postedAt: "1h ago",
    expiresIn: "71h",
    urgent: false,
  },
  {
    id: "5",
    title: "Deep clean small apartment",
    category: "cleaning",
    pay: 400,
    location: "Mabolo, Cebu City",
    coords: { latitude: 10.3230, longitude: 123.9180 },
    description: "Studio apartment needs thorough cleaning — floors, bathroom, kitchen. Around 3 hours of work. Cleaning supplies provided.",
    postedBy: "Ana T.",
    postedAt: "3h ago",
    expiresIn: "69h",
    urgent: true,
  },
  {
    id: "6",
    title: "Pick up documents from City Hall",
    category: "errands",
    pay: 120,
    location: "Downtown, Cebu City",
    coords: { latitude: 10.2939, longitude: 123.9020 },
    description: "Need someone to queue and pick up barangay clearance and cedula from City Hall. Will provide authorization letter.",
    postedBy: "Renz P.",
    postedAt: "4h ago",
    expiresIn: "68h",
    urgent: false,
  },
];

function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.searchContainer}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search quests..."
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

function CategoryPill({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.pill, active && styles.pillActive]}
    >
      <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function JobCard({ job, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleWrap}>
          {job.urgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
          <Text style={styles.cardTitle} numberOfLines={2}>
            {job.title}
          </Text>
        </View>
        <View style={styles.payWrap}>
          <Text style={styles.payAmount}>₱{job.pay}</Text>
          <Text style={styles.payLabel}>cash</Text>
        </View>
      </View>

      <Text style={styles.cardDesc} numberOfLines={2}>
        {job.description}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>📍</Text>
          <Text style={styles.metaText}>{job.location}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaIcon}>⌛</Text>
          <Text style={styles.metaText}>Expires in {job.expiresIn}</Text>
        </View>
      </View>

      <View style={styles.posterRow}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{job.postedBy[0]}</Text>
        </View>
        <Text style={styles.posterName}>{job.postedBy}</Text>
        <Text style={styles.postedAt}>{job.postedAt}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function JobFeed() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("list");

  const filtered = MOCK_JOBS.filter((job) => {
    const matchCat =
      activeCategory === "all" || job.category === activeCategory;

    const matchSearch =
      search.trim() === "" ||
      job.title.toLowerCase().includes(search.toLowerCase());

    return matchCat && matchSearch;
  });

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
            <JobCard job={item} onPress={() => router.push(`../job/${item.id}`)} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <WebView
          style={styles.map}
          source={{ html: buildMapHTML(filtered) }}
          onMessage={(e) => router.push("../job/" + e.nativeEvent.data)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  list: {
    // paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerBg: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    padding: Spacing.sm - 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  postBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  postText: {
    color: Colors.textMuted,
    fontWeight: "700",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    marginBottom: Spacing.md,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    color: Colors.textPrimary,
  },

  categoryRow: {
    gap: 10,
    paddingBottom: 10,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accent,
  },
  pillLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  pillLabelActive: {
    color: Colors.accent,
  },

  results: {
    marginVertical: 10,
    fontSize: 12,
    color: Colors.textPrimary,
  },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.md,
        gap: Spacing.sm,
        marginHorizontal: Spacing.md,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: Spacing.md,
    },
    cardTitleWrap: {
        flex: 1,
        gap: Spacing.xs,
    },
    urgentBadge: {
        alignSelf: "flex-start",
        backgroundColor: "rgba(255, 77, 77, 0.15)",
        borderWidth: 1,
        borderColor: Colors.error,
        borderRadius: Radius.sm,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
    },
    urgentText: {
        fontSize: FontSizes.xs,
        fontWeight: "800",
        color: Colors.error,
        letterSpacing: 1,
    },
    cardTitle: {
        fontSize: FontSizes.md,
        fontWeight: "700",
        color: Colors.textPrimary,
        lineHeight: 22,
    },
    payWrap: {
        alignItems: "flex-end",
    },
    payAmount: {
        fontSize: FontSizes.lg,
        fontWeight: "900",
        color: Colors.accent,
    },
    payLabel: {
        fontSize: FontSizes.xs,
        color: Colors.accentDim,
        letterSpacing: 0.3,
    },
    cardDesc: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
    cardFooter: {
        flexDirection: "row",
        gap: Spacing.md,
        paddingTop: Spacing.xs,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    metaIcon: {
        fontSize: 12,
    },
    metaText: {
        fontSize: FontSizes.xs,
        color: Colors.accent,
    },
    posterRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.sm,
    },
    avatarCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.accentGlow,
        borderWidth: 1,
        borderColor: Colors.accent,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        fontSize: 11,
        fontWeight: "700",
        color: Colors.accent,
    },
    posterName: {
        fontSize: FontSizes.xs,
        fontWeight: "600",
        color: Colors.textSecondary,
        flex: 1,
    },
    postedAt: {
        fontSize: FontSizes.xs,
        color: Colors.textMuted,
    },
    headerActions: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
    toggleBtn: {
        backgroundColor: Colors.surfaceRaised, paddingHorizontal: 14, paddingVertical: 6,
        borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.border,
    },
    toggleBtnText: { fontSize: 14, fontWeight: "700", color: Colors.textSecondary },
    map: { flex: 1 },
    callout: { width: 200, padding: 8 },
    calloutTitle: { fontSize: 13, fontWeight: "700", color: "#111", marginBottom: 2 },
    calloutPay: { fontSize: 13, fontWeight: "900", color: Colors.accentDim },
    calloutBtn: { marginTop: 4, fontSize: 12, fontWeight: "700", color: Colors.accent, textDecorationLine: "underline" },
});
