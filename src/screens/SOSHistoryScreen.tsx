import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Sound from "react-native-sound";

type MediaItem = {
  id: string;
  type: "audio" | "photo";
  url: string;
  duration?: number;
};

type SOSItem = {
  id: string;
  timestamp: string;
  status: string;
  location: { lat: number; lng: number };
  media: MediaItem[];
};

const PAGE_SIZE = 5;

export default function SOSHistoryScreen() {
  const [loading, setLoading] = useState(true);
  const [sosHistory, setSosHistory] = useState<SOSItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  useEffect(() => {
    fetchSOSHistory();
    return () => {
      if (currentSound) currentSound.release();
    };
  }, []);

  const fetchSOSHistory = async () => {
    try {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem("loggedInUser");
      if (!storedUser) {
        Alert.alert("Error", "User not found in storage.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      const res = await fetch(`https://rakshak-gamma.vercel.app/api/sos-alert/user/${user.id}`);
      const data = await res.json();

      if (data.success && data.sosHistory) {
        const sorted = data.sosHistory.sort(
          (a: SOSItem, b: SOSItem) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setSosHistory(sorted);
        setCurrentPage(1);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch SOS history");
      }
    } catch (err) {
      console.error("Fetch SOS history error:", err);
      Alert.alert("Error", "Something went wrong while fetching SOS history");
    } finally {
      setLoading(false);
    }
  };

  // Get items for current page
  const getDisplayedItems = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return sosHistory.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.ceil(sosHistory.length / PAGE_SIZE);

  // Go to specific page
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Generate visible pages with dots
  const getVisiblePages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages: (number | string)[] = [];
    const prev = currentPage - 1;
    const next = currentPage + 1;

    // Always show first page
    pages.push(1);

    // Left dots
    if (currentPage > 3) pages.push("...");

    // Middle pages (prev, current, next)
    for (let i = Math.max(2, prev); i <= Math.min(totalPages - 1, next); i++) {
      pages.push(i);
    }

    // Right dots
    if (currentPage < totalPages - 2) pages.push("...");

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  const openMap = (lat: number, lng: number) => {
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?ll=${lat},${lng}`
        : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) Linking.openURL(url);
        else Alert.alert("Error", "Unable to open map");
      })
      .catch((err) => console.error("Map open error:", err));
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const playAudio = (url: string, sosId: string) => {
    if (playingAudioId === sosId) {
      if (currentSound) {
        currentSound.stop(() => currentSound.release());
        setCurrentSound(null);
      }
      setPlayingAudioId(null);
      return;
    }

    if (currentSound) {
      currentSound.stop(() => currentSound.release());
    }

    const sound = new Sound(url, undefined, (error) => {
      if (error) {
        console.error("Failed to load sound", error);
        Alert.alert("Audio Error", "Failed to play audio");
        setPlayingAudioId(null);
        return;
      }

      setCurrentSound(sound);
      setPlayingAudioId(sosId);
      sound.play((success) => {
        if (!success) console.warn("Sound playback failed");
        setPlayingAudioId(null);
        setCurrentSound(null);
        sound.release();
      });
    });
  };

  const renderMedia = (media: MediaItem[], sosId: string, isExpanded: boolean) => {
    if (!media || media.length === 0) return null;

    const photos = media.filter((m) => m.type === "photo");
    const audios = media.filter((m) => m.type === "audio");

    return (
      <View style={styles.mediaContainer}>
        <TouchableOpacity style={styles.expandButton} onPress={() => toggleExpand(sosId)}>
          <View style={styles.expandButtonContent}>
            <Text style={styles.expandButtonText}>{isExpanded ? "Hide Media" : "View Media"}</Text>
            <View style={styles.mediaBadge}>
              <Text style={styles.mediaBadgeText}>{media.length}</Text>
            </View>
          </View>
          <Text style={styles.expandIcon}>{isExpanded ? "▼" : "▶"}</Text>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.mediaContent}>
            {photos.length > 0 && (
              <View style={styles.mediaSection}>
                <Text style={styles.mediaSectionTitle}>📷 Photos ({photos.length})</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
                  {photos.map((m,i) => (
                    <Image key={m.id} source={{ uri: m.url }} style={styles.mediaPhoto} />
                  ))}
                </ScrollView>
              </View>
            )}
            {audios.length > 0 && (
              <View style={styles.mediaSection}>
                <Text style={styles.mediaSectionTitle}>🎵 Audio ({audios.length})</Text>
                {audios.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.audioButton, playingAudioId === sosId && styles.audioButtonPlaying]}
                    onPress={() => playAudio(m.url, sosId)}
                  >
                    <Text style={styles.audioTitle}>{playingAudioId === sosId ? "Playing..." : "Play Audio"}</Text>
                    {m.duration && <Text style={styles.audioDuration}>{m.duration}s</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderItem = ({ item }: { item: SOSItem }) => {
    const isExpanded = expandedIds.includes(item.id);
    const isActive = item.status === "active";

    return (
      <View style={[styles.item, isActive && styles.itemActive]}>
        <View style={styles.itemHeader}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: isActive ? "#FF3B30" : "#8E8E93" }]} />
            <Text style={[styles.status, { color: isActive ? "#FF3B30" : "#8E8E93" }]}>{item.status.toUpperCase()}</Text>
          </View>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleString("en-US", { hour12: true })}
          </Text>
        </View>

        <TouchableOpacity onPress={() => openMap(item.location.lat, item.location.lng)}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: item.location.lat,
              longitude: item.location.lng,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            <Marker coordinate={{ latitude: item.location.lat, longitude: item.location.lng }} />
          </MapView>
        </TouchableOpacity>

        {renderMedia(item.media, item.id, isExpanded)}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Loading SOS history...</Text>
      </View>
    );
  }

  if (sosHistory.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🛡️</Text>
        <Text style={styles.emptyTitle}>No SOS History</Text>
        <Text style={styles.emptySubtitle}>Your emergency alerts will appear here</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOS History</Text>
      <FlatList
        data={getDisplayedItems()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
            onPress={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Text style={[styles.paginationButtonText, currentPage === 1 && styles.paginationButtonTextDisabled]}>
              Previous
            </Text>
          </TouchableOpacity>

          <View style={styles.pageNumbersContainer}>
            {getVisiblePages().map((page, idx) =>
              page === "..." ? (
                <Text key={`dots-${idx}`} style={[styles.pageButtonText, { marginHorizontal: 4 }]}>
                  ...
                </Text>
              ) : (
                <TouchableOpacity
                  key={page}
                  style={[styles.pageButton, currentPage === page && styles.pageButtonActive]}
                  onPress={() => goToPage(Number(page))}
                >
                  <Text style={[styles.pageButtonText, currentPage === page && styles.pageButtonTextActive]}>
                    {page}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          <TouchableOpacity
            style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
            onPress={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Text style={[styles.paginationButtonText, currentPage === totalPages && styles.paginationButtonTextDisabled]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    color: "white",
    backgroundColor: "red",
  },
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F2F2F7", padding: 20 },
  loadingText: { color: "#FF3B30", marginTop: 12, fontSize: 16, fontWeight: "500" },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: "600", color: "#000", marginBottom: 8 },
  emptySubtitle: { fontSize: 16, color: "#8E8E93", textAlign: "center" },
  listContent: { padding: 16 },
  item: { backgroundColor: "#FFF", borderRadius: 16, marginBottom: 16, padding: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  itemActive: { borderWidth: 2, borderColor: "#FF3B30" },
  itemHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  statusContainer: { flexDirection: "row", alignItems: "center" },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  status: { fontSize: 14, fontWeight: "700" },
  timestamp: { fontSize: 13, color: "#8E8E93", fontWeight: "500" },
  map: { width: "100%", height: 180, borderRadius: 12, marginVertical: 8 },
  mediaContainer: { paddingVertical: 8 },
  expandButton: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, backgroundColor: "#F9F9F9", borderRadius: 10 },
  expandButtonContent: { flexDirection: "row", alignItems: "center" },
  expandButtonText: { color: "#007AFF", fontSize: 15, fontWeight: "600", marginRight: 8 },
  mediaBadge: { backgroundColor: "#007AFF", borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, minWidth: 24, alignItems: "center" },
  mediaBadgeText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  expandIcon: { color: "#007AFF", fontSize: 12, fontWeight: "700" },
  mediaContent: { marginTop: 12 },
  mediaSection: { marginBottom: 12 },
  mediaSectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  photoScroll: { flexDirection: "row" },
  mediaPhoto: { width: 100, height: 100, borderRadius: 12, marginRight: 8, backgroundColor: "#E5E5EA" },
  audioButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#F2F2F7", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: "#E5E5EA", marginBottom: 6 },
  audioButtonPlaying: { backgroundColor: "#FFF0EF", borderColor: "#FF3B30" },
  audioTitle: { fontSize: 15, fontWeight: "600", color: "#000", marginRight: 6 },
  audioDuration: { fontSize: 13, color: "#8E8E93" },
  paginationContainer: {
    
    padding: 6,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    margin:3,
    alignItems: "center",
  },
  paginationButtonDisabled: {
    backgroundColor: "#E5E5EA",
  },
  paginationButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  paginationButtonTextDisabled: {
    color: "#8E8E93",
    minWidth: 40,
  },
  pageNumbersContainer: {
    flexDirection: "row",
    flexWrap:"wrap",
    justifyContent:"center",
    width:"100%",
    margin:"auto",
    gap: 8,
    marginVertical: 10,
  },
  pageButton: {
    width: 30,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    marginHorizontal: 2,
  },
  pageButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  pageButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },
  pageButtonTextActive: {
    color: "#FFF",
  },
});
