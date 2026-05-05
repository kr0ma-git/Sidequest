import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, FontSizes, Spacing, Radius } from "../constants/theme";
import { supabase } from "../config/supabaseConnection.js";

// ─────────────────────────────────────────────────────────────────────────────
// API shape expected from Express:
//
// GET /api/v1/jobs/posted          → { success, jobs: [...] }
//   jobs where posted_by = current user
//
// GET /api/v1/jobs/accepted        → { success, jobs: [...] }
//   jobs where taken_by = current user
//
// Each job object maps to the Supabase schema:
// {
//   id, created_at, job_title, description, category,
//   location: { address, latitude, longitude },
//   pay, urgent, expire, posted_by, taken_by,
//   status: "open" | "accepted" | "ongoing" | "completed" | "cancelled"
// }
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "posted",   label: "Posted",   icon: "briefcase-outline" },
  { id: "accepted", label: "Accepted", icon: "shield-checkmark-outline" },
];

const STATUS_CONFIG = {
  open:      { label: "Open",       color: Colors.success,     bg: "rgba(46,204,113,0.12)"  },
  accepted:  { label: "Accepted",   color: Colors.accent,      bg: "rgba(245,166,35,0.12)"  },
  ongoing:   { label: "Ongoing",    color: Colors.accent,      bg: "rgba(245,166,35,0.12)"  },
  completed: { label: "Completed",  color: Colors.textMuted,   bg: "rgba(136,136,136,0.1)"  },
  cancelled: { label: "Cancelled",  color: Colors.error,       bg: "rgba(255,77,77,0.12)"   },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatExpiry(expireTimestamp) {
  if (!expireTimestamp) return "—";
  const diff = new Date(expireTimestamp) - new Date();
  if (diff <= 0) return "Expired";
  const h = Math.floor(diff / 3600000);
  if (h < 24) return `${h}h left`;
  return `${Math.floor(h / 24)}d left`;
}

function formatPostedAt(createdAt) {
  if (!createdAt) return "—";
  const diff = Date.now() - new Date(createdAt);
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;
  return (
    <View style={[styles.statusBadge, { backgroundColor: cfg.bg, borderColor: cfg.color }]}>
      <Text style={[styles.statusText, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

// Card for jobs the user posted
function PostedCard({ job, onPress }) {
  const takenBy = job.taken_by;
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.card}>
      {/* Title + status */}
      <View style={styles.cardTop}>
        <View style={styles.cardTitleWrap}>
          {job.urgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
          <Text style={styles.cardTitle} numberOfLines={2}>{job.job_title}</Text>
        </View>
        <StatusBadge status={job.status} />
      </View>

      {/* Pay */}
      <Text style={styles.payLine}>
        <Text style={styles.payAmount}>₱{job.pay}</Text>
        <Text style={styles.payLabel}> cash</Text>
      </Text>

      {/* Meta */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.metaText} numberOfLines={1}>
            {job.location?.address ?? "—"}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="hourglass-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.metaText}>{formatExpiry(job.expire)}</Text>
        </View>
      </View>

      {/* Divider + taken-by info */}
      <View style={styles.cardFooter}>
        {takenBy ? (
          <View style={styles.takenRow}>
            <Ionicons name="person-circle-outline" size={14} color={Colors.accent} />
            <Text style={styles.takenText}>Accepted by someone</Text>
          </View>
        ) : (
          <View style={styles.takenRow}>
            <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.waitingText}>Waiting for a taker</Text>
          </View>
        )}
        <Text style={styles.postedAt}>{formatPostedAt(job.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}

// Card for jobs the user accepted
function AcceptedCard({ job, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.card}>
      {/* Title + status */}
      <View style={styles.cardTop}>
        <View style={styles.cardTitleWrap}>
          {job.urgent && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
          <Text style={styles.cardTitle} numberOfLines={2}>{job.job_title}</Text>
        </View>
        <StatusBadge status={job.status} />
      </View>

      {/* Pay */}
      <Text style={styles.payLine}>
        <Text style={styles.payAmount}>₱{job.pay}</Text>
        <Text style={styles.payLabel}> cash on completion</Text>
      </Text>

      {/* Meta */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.metaText} numberOfLines={1}>
            {job.location?.address ?? "—"}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="hourglass-outline" size={12} color={Colors.textMuted} />
          <Text style={styles.metaText}>{formatExpiry(job.expire)}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.takenRow}>
          <Ionicons name="person-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.waitingText}>Posted by someone</Text>
        </View>
        <Text style={styles.postedAt}>{formatPostedAt(job.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}

function EmptyState({ tab }) {
  const isPosted = tab === "posted";
  return (
    <View style={styles.emptyWrap}>
      <Ionicons
        name={isPosted ? "briefcase-outline" : "shield-checkmark-outline"}
        size={48}
        color={Colors.textMuted}
      />
      <Text style={styles.emptyTitle}>
        {isPosted ? "No quests posted yet" : "No quests accepted yet"}
      </Text>
      <Text style={styles.emptySubtext}>
        {isPosted
          ? "Tap '+ Post' on the feed to create your first listing."
          : "Browse the feed and accept a quest to get started."}
      </Text>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function MyQuests() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("posted");
  const [postedJobs, setPostedJobs] = useState([]);
  const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    await Promise.all([fetchPosted(), fetchAccepted()]);
    setLoading(false);
  }

  async function fetchPosted() {
    try {
      // TODO: attach auth header once session tokens are wired up
      // const { data: { session } } = await supabase.auth.getSession();
      // headers: { Authorization: `Bearer ${session.access_token}` }
      const res = await fetch(`${process.env.EXPO_PUBLIC_LOCAL_URI}/api/v1/jobs/posted`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      if (data.success) setPostedJobs(data.jobs);
    } catch (err) {
      console.log("fetchPosted error:", err.message);
    }
  }

  async function fetchAccepted() {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_LOCAL_URI}/api/v1/jobs/accepted`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      if (data.success) setAcceptedJobs(data.jobs);
    } catch (err) {
      console.log("fetchAccepted error:", err.message);
    }
  }

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchPosted(), fetchAccepted()]);
    setRefreshing(false);
  }, []);

  const currentData = activeTab === "posted" ? postedJobs : acceptedJobs;

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={Colors.accent} size="large" />
        <Text style={styles.loadingText}>Loading your quests…</Text>
      </View>
    );
  }

  return (
    <View style={styles.safe}>

      {/* Header */}
      <View style={styles.headerBg}>
        <Text style={styles.screenTitle}>My Quests</Text>

        {/* Tab switcher */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            const count = tab.id === "posted" ? postedJobs.length : acceptedJobs.length;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={tab.icon}
                  size={16}
                  color={active ? Colors.accent : Colors.textMuted}
                />
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
                <View style={[styles.countBadge, active && styles.countBadgeActive]}>
                  <Text style={[styles.countText, active && styles.countTextActive]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={currentData}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) =>
          activeTab === "posted" ? (
            <PostedCard
              job={item}
              onPress={() => router.push(`../job/${item.id}`)}
            />
          ) : (
            <AcceptedCard
              job={item}
              onPress={() => router.push(`../job/${item.id}`)}
            />
          )
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState tab={activeTab} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
      />

    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Loading
  loadingWrap: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    fontWeight: "600",
  },

  // Header
  headerBg: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  screenTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "800",
    color: Colors.textPrimary,
  },

  // Tab switcher
  tabBar: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.accentGlow,
    borderColor: Colors.accent,
  },
  tabLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "700",
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.accent,
  },
  countBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  countBadgeActive: {
    backgroundColor: Colors.accent,
  },
  countText: {
    fontSize: FontSizes.xs,
    fontWeight: "800",
    color: Colors.textMuted,
  },
  countTextActive: {
    color: Colors.background,
  },

  // List
  list: {
    gap: Spacing.md,
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },

  // Cards
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  cardTitleWrap: {
    flex: 1,
    gap: Spacing.xs,
  },
  urgentBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,77,77,0.15)",
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
  statusBadge: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    marginTop: 2,
  },
  statusText: {
    fontSize: FontSizes.xs,
    fontWeight: "700",
    letterSpacing: 0.4,
  },

  // Pay
  payLine: {
    marginTop: -Spacing.xs,
  },
  payAmount: {
    fontSize: FontSizes.lg,
    fontWeight: "900",
    color: Colors.accent,
  },
  payLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },

  // Meta row
  metaRow: {
    flexDirection: "row",
    gap: Spacing.md,
    flexWrap: "wrap",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  metaText: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    flex: 1,
  },

  // Footer
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  takenRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  takenText: {
    fontSize: FontSizes.xs,
    color: Colors.accent,
    fontWeight: "600",
  },
  waitingText: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  postedAt: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },

  // Empty state
  emptyWrap: {
    alignItems: "center",
    paddingTop: Spacing.xxl,
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});