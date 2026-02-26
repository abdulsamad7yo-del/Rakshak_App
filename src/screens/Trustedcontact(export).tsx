import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
  StatusBar,
  Animated,
} from "react-native";
import Contacts from "react-native-contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  UserPlusIcon,
  XMarkIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/solid";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Contact {
  id: string;
  name: string;
  phone: string;
}

interface DeviceContact {
  recordID: string;
  displayName: string | null;
  phoneNumbers?: Array<{ number?: string }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const AVATAR_COLORS = [
  "#E57373", "#F06292", "#BA68C8", "#9575CD",
  "#64B5F6", "#4FC3F7", "#4DD0E1", "#4DB6AC",
  "#81C784", "#AED581", "#FFB74D", "#FF8A65",
];

const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TrustedContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deviceContacts, setDeviceContacts] = useState<DeviceContact[]>([]);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingContact, setAddingContact] = useState(false);

  const [deviceSearchText, setDeviceSearchText] = useState("");

  const API_BASE = "https://rakshak-gamma.vercel.app/api/user";

  // ── Load user ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem("loggedInUser");
        if (userStr) {
          const parsed = JSON.parse(userStr);
          setUserId(parsed.id);
        }
      } catch {
        Alert.alert("Error", "Unable to load user.");
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // ── Fetch trusted contacts ────────────────────────────────────────────────────
  const fetchContacts = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${userId}/trusted-friends`);
      const data = await res.json();
      if (data.success) setContacts(data.friends || []);
    } catch {
      Alert.alert("Error", "Unable to load contacts.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchContacts();
  }, [userId]);

  // ── Validate phone ────────────────────────────────────────────────────────────
  const isValidPhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  // ── Add manual contact ────────────────────────────────────────────────────────
  const addContact = async () => {
    if (!newName.trim() || !newPhone.trim())
      return Alert.alert("Missing Info", "Please fill in both name and phone number.");
    if (!isValidPhone(newPhone))
      return Alert.alert("Invalid Phone", "Phone number must be exactly 10 digits.");
    if (!userId) return;

    setAddingContact(true);
    try {
      const res = await fetch(`${API_BASE}/${userId}/trusted-friends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), phone: newPhone }),
      });
      const data = await res.json();
      if (data.success) {
        setNewName("");
        setNewPhone("");
        fetchContacts();
      }
    } catch {
      Alert.alert("Error", "Unable to add contact.");
    }
    setAddingContact(false);
  };

  // ── Device contacts permission + load ─────────────────────────────────────────
  const requestPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const loadDeviceContacts = async () => {
    const granted = await requestPermission();
    if (!granted) return Alert.alert("Permission Denied", "Contacts access is required.");
    try {
      const list = await Contacts.getAll();
      const usable = list.filter((c: any) => c.phoneNumbers?.length);
      setDeviceContacts(usable);
      setShowDeviceModal(true);
    } catch {
      Alert.alert("Error", "Unable to access contacts.");
    }
  };

  // ── Select device contact ─────────────────────────────────────────────────────
  const selectDeviceContact = async (c: DeviceContact) => {
    if (!userId) return;
    const raw = c.phoneNumbers?.[0]?.number || "";
    const phone = raw.replace(/\D/g, "").slice(-10);
    if (!isValidPhone(phone))
      return Alert.alert("Invalid", "Contact must have a valid 10-digit phone number.");
    if (contacts.find((x) => x.phone === phone))
      return Alert.alert("Already Added", "This contact is already in your trusted list.");
    try {
      const res = await fetch(`${API_BASE}/${userId}/trusted-friends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: c.displayName || "Unknown", phone }),
      });
      const data = await res.json();
      if (data.success) fetchContacts();
    } catch {
      Alert.alert("Error", "Unable to save contact.");
    }
    setShowDeviceModal(false);
  };

  // // ── Edit contact ──────────────────────────────────────────────────────────────
  // const startEdit = (contact: Contact) => {
  //   setEditingContact(contact);
  //   setEditName(contact.name);
  //   setEditPhone(contact.phone);
  //   setEditModalVisible(true);
  // };

  // const saveEdit = async () => {
  //   if (!editingContact || !userId) return;
  //   if (!isValidPhone(editPhone))
  //     return Alert.alert("Invalid Phone", "Phone number must be exactly 10 digits.");
  //   try {
  //     const res = await fetch(
  //       `${API_BASE}/${userId}/trusted-friends/${editingContact.id}`,
  //       {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ name: editName, phone: editPhone }),
  //       }
  //     );
  //     const data = await res.json();
  //     if (data.success) {
  //       setEditModalVisible(false);
  //       setEditingContact(null);
  //       fetchContacts();
  //     }
  //   } catch {
  //     Alert.alert("Error", "Unable to update contact.");
  //   }
  // };

  // ── Delete contact ────────────────────────────────────────────────────────────
  const deleteContact = (id: string) => {
    if (!userId) return;
    Alert.alert("Remove Contact", "Are you sure you want to remove this trusted contact?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          await fetch(`${API_BASE}/${userId}/trusted-friends/${id}`, {
            method: "DELETE",
          });
          fetchContacts();
        },
      },
    ]);
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#D32F2F" />
          <Text style={styles.loadingText}>Loading contacts…</Text>
        </View>
      </View>
    );

  const filteredDeviceContacts = deviceContacts.filter((c) =>
    c.displayName?.toLowerCase().includes(deviceSearchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#B71C1C" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerIconWrap}>
          <ShieldCheckIcon size={28} color="#FFCDD2" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Trusted Contacts</Text>
          <Text style={styles.headerSubtitle}>
            {contacts.length} {contacts.length === 1 ? "person" : "people"} in your safety circle
          </Text>
        </View>
      </View>

      {/* ── Add Contact Card ── */}
      <View style={styles.addCard}>
        <Text style={styles.addCardLabel}>Add Manually</Text>

        <TextInput
          style={styles.inputField}
          placeholder="Full name"
          placeholderTextColor="#9E9E9E"
          value={newName}
          onChangeText={setNewName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.inputField}
          placeholder="10-digit phone number"
          placeholderTextColor="#9E9E9E"
          keyboardType="phone-pad"
          maxLength={10}
          value={newPhone}
          onChangeText={setNewPhone}
        />

        <View style={styles.addActionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnPrimary, addingContact && styles.actionBtnDisabled]}
            onPress={addContact}
            disabled={addingContact}
            activeOpacity={0.8}
          >
            {addingContact ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <PlusCircleIcon size={18} color="#fff" />
            )}
            <Text style={styles.actionBtnText}>
              {addingContact ? "Adding…" : "Add Contact"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnSecondary]}
            onPress={loadDeviceContacts}
            activeOpacity={0.8}
          >
            <UserPlusIcon size={18} color="#D32F2F" />
            <Text style={[styles.actionBtnText, styles.actionBtnTextSecondary]}>
              From Phone
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Contact List ── */}
      {contacts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🛡️</Text>
          <Text style={styles.emptyTitle}>No trusted contacts yet</Text>
          <Text style={styles.emptySubtitle}>
            Add friends or family who should be alerted in an emergency.
          </Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={[styles.contactCard, index === 0 && { marginTop: 0 }]}>
              {/* Avatar */}
              <View style={[styles.avatar, { backgroundColor: avatarColor(item.name) }]}>
                <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
              </View>

              {/* Info */}
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactPhone}>{item.phone}</Text>
              </View>

              {/* Actions */}
              <View style={styles.contactActions}>
                {/* <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => startEdit(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <PencilSquareIcon size={20} color="#1565C0" />
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={[styles.iconBtn, styles.iconBtnDanger]}
                  onPress={() => deleteContact(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <XMarkIcon size={20} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* ── Device Contacts Modal ── */}
      <Modal visible={showDeviceModal} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            {/* Handle */}
            <View style={styles.sheetHandle} />

            <Text style={styles.sheetTitle}>Select from Phone</Text>
            <Text style={styles.sheetSubtitle}>
              {filteredDeviceContacts.length} contacts available
            </Text>

            {/* Search */}
            <View style={styles.searchRow}>
              <MagnifyingGlassIcon size={18} color="#9E9E9E" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search contacts…"
                placeholderTextColor="#BDBDBD"
                value={deviceSearchText}
                onChangeText={setDeviceSearchText}
              />
            </View>

            <FlatList
              data={filteredDeviceContacts}
              keyExtractor={(i) => i.recordID}
              showsVerticalScrollIndicator={false}
              style={styles.deviceList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.deviceItem}
                  onPress={() => selectDeviceContact(item)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.avatarSmall, { backgroundColor: avatarColor(item.displayName || "?") }]}>
                    <Text style={styles.avatarSmallText}>
                      {getInitials(item.displayName || "?")}
                    </Text>
                  </View>
                  <View style={styles.deviceItemInfo}>
                    <Text style={styles.deviceName}>{item.displayName}</Text>
                    <Text style={styles.devicePhone}>{item.phoneNumbers?.[0]?.number}</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptySearch}>No contacts found</Text>
              }
            />

            <TouchableOpacity
              style={styles.sheetCloseBtn}
              onPress={() => { setShowDeviceModal(false); setDeviceSearchText(""); }}
              activeOpacity={0.8}
            >
              <Text style={styles.sheetCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Edit Modal ──
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.editCard}>
            <Text style={styles.editTitle}>Edit Contact</Text>

            <Text style={styles.editLabel}>Name</Text>
            <TextInput
              style={styles.inputField}
              value={editName}
              onChangeText={setEditName}
              autoCapitalize="words"
              placeholderTextColor="#9E9E9E"
            />

            <Text style={styles.editLabel}>Phone</Text>
            <TextInput
              style={styles.inputField}
              keyboardType="phone-pad"
              maxLength={10}
              value={editPhone}
              onChangeText={setEditPhone}
              placeholderTextColor="#9E9E9E"
            />

            <View style={styles.editActions}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnPrimary, { flex: 1 }]}
                onPress={saveEdit}
                activeOpacity={0.8}
              >
                <Text style={styles.actionBtnText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnGhost, { flex: 1 }]}
                onPress={() => setEditModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.actionBtnText, styles.actionBtnTextGhost]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  loadingText: {
    fontSize: 15,
    color: "#757575",
    fontWeight: "500",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#C62828",
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerIconWrap: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#FFCDD2",
    marginTop: 2,
    fontWeight: "400",
  },

  // Add Card
  addCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    borderRadius: 16,
    padding: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  addCardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9E9E9E",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  inputField: {
    borderWidth: 1.5,
    borderColor: "#EEEEEE",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: "#212121",
    backgroundColor: "#FAFAFA",
    marginBottom: 10,
  },
  addActionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flex: 1,
  },
  actionBtnPrimary: {
    backgroundColor: "#D32F2F",
  },
  actionBtnSecondary: {
    backgroundColor: "#FFEBEE",
    borderWidth: 1.5,
    borderColor: "#FFCDD2",
  },
  actionBtnGhost: {
    backgroundColor: "#F5F5F5",
  },
  actionBtnDisabled: {
    opacity: 0.6,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  actionBtnTextSecondary: {
    color: "#D32F2F",
  },
  actionBtnTextGhost: {
    color: "#757575",
  },

  // Contact List
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
  },
  contactPhone: {
    fontSize: 13,
    color: "#757575",
    marginTop: 2,
  },
  contactActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconBtn: {
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    padding: 8,
  },
  iconBtnDanger: {
    backgroundColor: "#FFEBEE",
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: -40,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#424242",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9E9E9E",
    textAlign: "center",
    lineHeight: 20,
  },

  // Overlay
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  // Bottom Sheet (Device Contacts)
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "82%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#212121",
    textAlign: "center",
  },
  sheetSubtitle: {
    fontSize: 13,
    color: "#9E9E9E",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#212121",
    padding: 0,
  },
  deviceList: {
    maxHeight: 380,
  },
  deviceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderColor: "#F5F5F5",
    gap: 12,
  },
  avatarSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSmallText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  deviceItemInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#212121",
  },
  devicePhone: {
    fontSize: 13,
    color: "#9E9E9E",
    marginTop: 1,
  },
  emptySearch: {
    textAlign: "center",
    color: "#BDBDBD",
    fontSize: 14,
    paddingVertical: 20,
  },
  sheetCloseBtn: {
    backgroundColor: "#D32F2F",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 14,
  },
  sheetCloseBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    textAlign: "center",
  },

  // Edit Card (centered modal)
  editCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  editTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212121",
    marginBottom: 18,
    textAlign: "center",
  },
  editLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9E9E9E",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
});