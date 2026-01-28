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
} from "react-native";
import Contacts from "react-native-contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Icon } from "react-native-elements";
import { PencilIcon } from "react-native-heroicons/outline";
import { PencilSquareIcon, PlusCircleIcon, UserPlusIcon, XMarkIcon } from "react-native-heroicons/solid";

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

  const [deviceSearchText, setDeviceSearchText] = useState("");




  const API_BASE = "https://rakshak-gamma.vercel.app/api/user";

  // ---------------------------------------------
  // Load USER from Async Storage
  // ---------------------------------------------
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

  // ---------------------------------------------
  // Fetch trusted contacts from backend
  // ---------------------------------------------
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

  // ---------------------------------------------
  // Validate 10-digit phone number
  // ---------------------------------------------
  const isValidPhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  // ---------------------------------------------
  // Add Manual Contact
  // ---------------------------------------------
  const addContact = async () => {
    if (!newName.trim() || !newPhone.trim())
      return Alert.alert("Error", "Fill all fields");

    if (!isValidPhone(newPhone))
      return Alert.alert("Error", "Phone must be 10 digits");

    if (!userId) return;

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
      Alert.alert("Error", "Unable to add contact");
    }
  };

  // ---------------------------------------------
  // Ask permission & load device contacts
  // ---------------------------------------------
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
    if (!granted) return Alert.alert("Permission Denied");

    try {
      const list = await Contacts.getAll();
      const usable = list.filter((c: any) => c.phoneNumbers?.length);
      setDeviceContacts(usable);
      setShowDeviceModal(true);
    } catch {
      Alert.alert("Error", "Unable to access contacts");
    }
  };

  // ---------------------------------------------
  // Handle selecting contact from phone book
  // ---------------------------------------------
  const selectDeviceContact = async (c: DeviceContact) => {
    if (!userId) return;

    const raw = c.phoneNumbers?.[0]?.number || "";
    const phone = raw.replace(/\D/g, "").slice(-10);

    if (!isValidPhone(phone))
      return Alert.alert("Invalid", "Contact must have valid phone");

    if (contacts.find((x) => x.phone === phone))
      return Alert.alert("Exists", "Already added");

    try {
      const res = await fetch(`${API_BASE}/${userId}/trusted-friends`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: c.displayName || "Unknown",
          phone,
        }),
      });
      const data = await res.json();
      if (data.success) fetchContacts();
    } catch {
      Alert.alert("Error", "Unable to save");
    }

    setShowDeviceModal(false);
  };

  // ---------------------------------------------
  // Edit Contact
  // ---------------------------------------------
  const startEdit = (contact: Contact) => {
    setEditingContact(contact);
    setEditName(contact.name);
    setEditPhone(contact.phone);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    if (!editingContact || !userId) return;
    if (!isValidPhone(editPhone))
      return Alert.alert("Error", "Phone must be 10 digits");

    try {
      const res = await fetch(
        `${API_BASE}/${userId}/trusted-friends/${editingContact.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: editName, phone: editPhone }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setEditModalVisible(false);
        setEditingContact(null);
        fetchContacts();
      }
    } catch {
      Alert.alert("Error", "Unable to update");
    }
  };

  // ---------------------------------------------
  // Delete Contact
  // ---------------------------------------------
  const deleteContact = (id: string) => {
    if (!userId) return;

    Alert.alert("Delete ?", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
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

  // ---------------------------------------------
  // UI RENDER
  // ---------------------------------------------
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trusted Contacts</Text>

      {/* Add input row */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="name"
          value={newName}
          onChangeText={setNewName}
        />
        <TextInput
          style={styles.input}
          placeholder="phone number"
          keyboardType="phone-pad"
          maxLength={10}
          value={newPhone}
          onChangeText={setNewPhone}
        />
        <View style={styles.btnRow}>

          <TouchableOpacity style={styles.addBtn} onPress={addContact}>
            {/* <Icon name="add" color="#fff" />
           */}
            <PlusCircleIcon />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.addBtn, styles.blueBtn]}
            onPress={loadDeviceContacts}
          >
            {/* <Icon name="contacts" color="#fff" />
           */}
            <UserPlusIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* Users trusted contacts */}
      <FlatList
        data={contacts}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.contactText}>
              {item.name} ({item.phone})
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity onPress={() => startEdit(item)}>
                <PencilSquareIcon />

              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteContact(item.id)}>
                {/* <Icon name="delete" color="#ff0000" /> */}
                <XMarkIcon />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* DEVICE CONTACTS MODAL */}
      <Modal visible={showDeviceModal} transparent animationType="slide">
  <View style={styles.overlay}>
    <View style={styles.modalBox}>
      <Text style={styles.modalTitle}>Select Contact</Text>

      {/* Search input for device contacts */}
      <TextInput
        style={styles.modalSearchInput}
        placeholder="Search contacts..."
        value={deviceSearchText}
        onChangeText={setDeviceSearchText}
      />

      <FlatList
        data={deviceContacts.filter((c) =>
          c.displayName?.toLowerCase().includes(deviceSearchText.toLowerCase())
        )}
        keyExtractor={(i) => i.recordID}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.deviceItem}
            onPress={() => selectDeviceContact(item)}
          >
            <Text style={styles.deviceName}>{item.displayName}</Text>
            <Text style={styles.devicePhone}>
              {item.phoneNumbers?.[0]?.number}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => setShowDeviceModal(false)}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


      {/* EDIT MODAL */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.editBox}>
            <Text style={styles.modalTitle}>Edit Contact</Text>

            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              maxLength={10}
              value={editPhone}
              onChangeText={setEditPhone}
            />

            <View style={styles.editBtns}>
              <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ---------------------------------------------
// STYLES
// ---------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 0, backgroundColor: "#FFF" },

  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    color: "white",

    backgroundColor: "red"
  },

  inputRow: {
    // flexDirection: "row",
    // alignItems: "center",
    paddingHorizontal: 20,
    gap: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ff0000",
    borderRadius: 6,
    padding: 10,
    
    backgroundColor:"#818283ff"
   
    // width: 130,

 
  },

  addBtn: {
    backgroundColor: "#a3e867ff",
    padding: 10,
    // margin: "auto",
    borderRadius: 6,

  },

  blueBtn: { backgroundColor: "#90b2dfff" },
  btnRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap:10

  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  contactText: { fontSize: 16 },

  actions: { flexDirection: "row", gap: 12 },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalBox: {
    backgroundColor: "#fff",
    width: "85%",
    padding: 20,
    borderRadius: 10,
    maxHeight: "80%",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff0000",
    marginBottom: 10,
    textAlign: "center",
  },

  deviceItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  deviceName: { fontSize: 16 },
  devicePhone: { fontSize: 14, color: "#555" },

  closeBtn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ff0000",
    borderRadius: 6,
  },

  closeText: { color: "#fff", textAlign: "center" },

  editBox: {
    backgroundColor: "#fff",
    width: 300,
    padding: 20,
    borderRadius: 10,
  },

  editBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
modalSearchInput: {
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  padding: 8,
  color:"white",
  marginBottom: 10,
  marginHorizontal: 0,
  backgroundColor:"#d00505ff"
},

  saveBtn: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 6,
    width: 110,
    alignItems: "center",
  },

  saveText: { color: "#fff", fontWeight: "bold" },

  cancelBtn: {
    backgroundColor: "#777",
    padding: 10,
    borderRadius: 6,
    width: 110,
    alignItems: "center",
  },

  cancelText: { color: "#fff", fontWeight: "bold" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
