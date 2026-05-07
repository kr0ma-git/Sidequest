import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { Colors, FontSizes, Spacing, Radius } from "../constants/theme";
import { supabase } from "../config/supabaseConnection.js";
import { useRouter } from "expo-router";
import { PopUp } from "../components/PopUp.jsx";

const MOCK_STATS = {
  posted: 12,
  completed: 7,
  earnings: 2850,
};

const MOCK_POSTED = [
  { id: "p1", title: "Deliver groceries to Lahug", status: "Active", date: "May 2" },
  { id: "p2", title: "Fix leaking faucet in kitchen", status: "Completed", date: "Apr 28" },
  { id: "p3", title: "Deep clean small apartment", status: "Completed", date: "Apr 15" },
  { id: "p4", title: "Math tutor for Grade 10", status: "Cancelled", date: "Apr 10" },
  { id: "p5", title: "Pick up documents from City Hall", status: "Active", date: "May 4" },
];

const MOCK_ACCEPTED = [
  { id: "a1", title: "Move furniture to 2nd floor", status: "Completed", date: "May 1" },
  { id: "a2", title: "Help organize garage sale", status: "Completed", date: "Apr 20" },
  { id: "a3", title: "Walk neighbor's dog", status: "Active", date: "May 3" },
];

const statusColor = {
  Active: Colors.accent,
  Completed: Colors.success,
  Cancelled: Colors.error,
};

function ProfileHeader({ user, onEdit }) {
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View style={styles.headerCard}>
      <View style={styles.avatarRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.nameWrap}>
          <Text style={styles.fullName}>{user.fullName}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
        <Text style={styles.editBtnText}>Edit Profile</Text>
      </TouchableOpacity>
      <Text style={styles.memberSince}>Member since {user.memberSince}</Text>
    </View>
  );
}

function StatCard({ value, label }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function StatsSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Stats</Text>
      <View style={styles.statsRow}>
        <StatCard value={MOCK_STATS.posted} label="Posted" />
        <StatCard value={MOCK_STATS.completed} label="Completed" />
        <StatCard value={`₱${MOCK_STATS.earnings.toLocaleString()}`} label="Earnings" />
      </View>
    </View>
  );
}

function SettingsRow({ icon, label, right, onPress }) {
  return (
    <TouchableOpacity style={styles.settingsRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingsRowLeft}>
        <Text style={styles.settingsIcon}>{icon}</Text>
        <Text style={styles.settingsLabel}>{label}</Text>
      </View>
      <View style={styles.settingsRowRight}>{right}</View>
    </TouchableOpacity>
  );
}

function SettingsSection({ notifications, onToggleNotifications, onChangePassword }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account Settings</Text>
      <View style={styles.settingsCard}>
        <SettingsRow icon="👤" label="Edit Profile" right={<Text style={styles.chevron}>›</Text>} onPress={() => {}} />
        <View style={styles.rowDivider} />
        <SettingsRow
          icon="🔔"
          label="Push Notifications"
          right={<Switch value={notifications} onValueChange={onToggleNotifications} trackColor={{ true: Colors.accent, false: Colors.border }} thumbColor={Colors.textPrimary} />}
        />
        <View style={styles.rowDivider} />
        <SettingsRow icon="🔒" label="Change Password" right={<Text style={styles.chevron}>›</Text>} onPress={onChangePassword} />
        <View style={styles.rowDivider} />
        <SettingsRow icon="🛡️" label="Privacy" right={<Text style={styles.chevron}>›</Text>} onPress={() => {}} />
      </View>
    </View>
  );
}

function QuestHistoryCard({ quest, onPress }) {
  return (
    <TouchableOpacity style={styles.questCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.questHeader}>
        <Text style={styles.questTitle} numberOfLines={1}>
          {quest.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor[quest.status] + "22", borderColor: statusColor[quest.status] }]}>
          <Text style={[styles.statusText, { color: statusColor[quest.status] }]}>{quest.status}</Text>
        </View>
      </View>
      <Text style={styles.questDate}>{quest.date}</Text>
    </TouchableOpacity>
  );
}

function QuestHistorySection() {
  const [activeTab, setActiveTab] = useState("posted");

  const quests = activeTab === "posted" ? MOCK_POSTED : MOCK_ACCEPTED;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quest History</Text>
      <View style={styles.historyCard}>
        <View style={styles.historyTabs}>
          <TouchableOpacity
            style={[styles.historyTab, activeTab === "posted" && styles.historyTabActive]}
            onPress={() => setActiveTab("posted")}
          >
            <Text style={[styles.historyTabText, activeTab === "posted" && styles.historyTabTextActive]}>
              Posted
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.historyTab, activeTab === "accepted" && styles.historyTabActive]}
            onPress={() => setActiveTab("accepted")}
          >
            <Text style={[styles.historyTabText, activeTab === "accepted" && styles.historyTabTextActive]}>
              Accepted
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.questList}>
          {quests.map((q) => (
            <QuestHistoryCard key={q.id} quest={q} onPress={() => {}} />
          ))}
        </View>
      </View>
    </View>
  );
}

function EditProfileModal({ visible, onClose, onSave }) {
  const [name, setName] = useState("Juan Dela Cruz");

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Edit Profile</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.modalInput}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <TouchableOpacity style={styles.modalSaveBtn} onPress={() => { onSave(name); onClose(); }}>
            <Text style={styles.modalSaveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function ChangePasswordModal({ visible, onClose }) {
  const [current, setCurrent] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Change Password</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <TextInput style={styles.modalInput} value={current} onChangeText={setCurrent} secureTextEntry placeholder="••••••••" placeholderTextColor={Colors.textMuted} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password</Text>
            <TextInput style={styles.modalInput} value={newPwd} onChangeText={setNewPwd} secureTextEntry placeholder="Min. 8 characters" placeholderTextColor={Colors.textMuted} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput style={styles.modalInput} value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="••••••••" placeholderTextColor={Colors.textMuted} />
          </View>

          <TouchableOpacity style={styles.modalSaveBtn} onPress={onClose}>
            <Text style={styles.modalSaveText}>Update Password</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState({ fullName: "Juan Dela Cruz", username: "juandelacruz", memberSince: "Jan 2025" });
  const [notifications, setNotifications] = useState(true);
  const [editVisible, setEditVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      router.replace("/(auth)");
    } catch (e) {
      setLogoutPopup(true);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerBg}>
        <Text style={styles.pageTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ProfileHeader user={user} onEdit={() => setEditVisible(true)} />
        <StatsSection />
        <SettingsSection
          notifications={notifications}
          onToggleNotifications={setNotifications}
          onChangePassword={() => setPasswordVisible(true)}
        />
        <QuestHistorySection />

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>v1.0.0</Text>
      </ScrollView>

      <EditProfileModal visible={editVisible} onClose={() => setEditVisible(false)} onSave={(name) => setUser((u) => ({ ...u, fullName: name }))} />
      <ChangePasswordModal visible={passwordVisible} onClose={() => setPasswordVisible(false)} />
      {logoutPopup && <PopUp message="Failed to log out. Please try again." visible={logoutPopup} isAlert={true} onClose={() => setLogoutPopup(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  headerBg: { padding: Spacing.md, paddingBottom: Spacing.sm },
  pageTitle: { fontSize: FontSizes.xl, fontWeight: "800", color: Colors.textPrimary },

  scroll: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxl, gap: Spacing.lg },

  // Header Card
  headerCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    alignItems: "center",
  },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: Spacing.md },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accentGlow,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: FontSizes.xl, fontWeight: "800", color: Colors.accent },
  nameWrap: { flex: 1 },
  fullName: { fontSize: FontSizes.lg, fontWeight: "800", color: Colors.textPrimary },
  username: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  editBtn: {
    marginTop: Spacing.md,
    backgroundColor: Colors.accentGlow,
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  editBtnText: { fontSize: FontSizes.sm, fontWeight: "700", color: Colors.accent },
  memberSince: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: Spacing.xs },

  // Stats
  section: {},
  sectionTitle: { fontSize: FontSizes.md, fontWeight: "800", color: Colors.textPrimary, marginBottom: Spacing.sm },
  statsRow: { flexDirection: "row", gap: Spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  statValue: { fontSize: FontSizes.lg, fontWeight: "900", color: Colors.accent },
  statLabel: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginTop: 2 },

  // Settings
  settingsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  settingsRowLeft: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  settingsIcon: { fontSize: 18 },
  settingsLabel: { fontSize: FontSizes.sm, fontWeight: "600", color: Colors.textPrimary },
  settingsRowRight: { alignItems: "center" },
  chevron: { fontSize: FontSizes.lg, color: Colors.textMuted },
  rowDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },

  // Quest History
  historyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  historyTabs: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: Colors.border },
  historyTab: { flex: 1, paddingVertical: Spacing.sm, alignItems: "center" },
  historyTabActive: { borderBottomWidth: 2, borderBottomColor: Colors.accent },
  historyTabText: { fontSize: FontSizes.sm, fontWeight: "700", color: Colors.textMuted },
  historyTabTextActive: { color: Colors.accent },
  questList: { gap: Spacing.xs, padding: Spacing.sm },
  questCard: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  questHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  questTitle: { flex: 1, fontSize: FontSizes.sm, fontWeight: "600", color: Colors.textPrimary, marginRight: Spacing.sm },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.sm, borderWidth: 1 },
  statusText: { fontSize: FontSizes.xs, fontWeight: "700" },
  questDate: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: Spacing.xs },

  // Logout
  logoutBtn: {
    backgroundColor: "rgba(255, 77, 77, 0.1)",
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  logoutText: { fontSize: FontSizes.sm, fontWeight: "700", color: Colors.error },
  version: { textAlign: "center", fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: Spacing.sm },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: Colors.background, borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg, padding: Spacing.lg, paddingBottom: Spacing.xxl },
  modalHandle: { width: 40, height: 5, backgroundColor: Colors.border, borderRadius: 3, alignSelf: "center", marginBottom: Spacing.md },
  modalTitle: { fontSize: FontSizes.md, fontWeight: "800", color: Colors.textPrimary, textAlign: "center", marginBottom: Spacing.md },
  inputGroup: { marginBottom: Spacing.sm },
  inputLabel: { fontSize: FontSizes.xs, fontWeight: "700", color: Colors.textSecondary, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  modalInput: { backgroundColor: Colors.surfaceRaised, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: FontSizes.sm, color: Colors.textPrimary },
  modalSaveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.full, paddingVertical: Spacing.md, alignItems: "center", marginTop: Spacing.sm },
  modalSaveText: { fontSize: FontSizes.sm, fontWeight: "800", color: Colors.background },
});
