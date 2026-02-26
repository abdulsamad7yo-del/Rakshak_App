import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
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

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  // Backgrounds
  bg: "#F4F6FA",
  surface: "#FFFFFF",
  surfaceAlt: "#F8F9FC",
  surfaceHover: "#EEF1F8",
  surfacePress: "#E8EDF6",

  // Borders
  border: "#E2E8F2",
  borderSubtle: "#EDF0F7",

  // Accent — deep crimson
  accent: "#C0232B",
  accentBright: "#E02E38",
  accentSoft: "#FFF0F1",
  accentMuted: "#FACCCE",
  accentText: "#B01D24",

  // Blue
  blue: "#2563EB",
  blueDim: "#93B8F8",
  blueLight: "#EEF4FF",
  blueSoft: "rgba(37,99,235,0.08)",

  // Text
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  textDim: "#CBD5E1",

  // Status
  statusResolved: "#94A3B8",
  successGreen: "#059669",
  successSoft: "#ECFDF5",
  successMuted: "#A7F3D0",

  white: "#FFFFFF",
  shadow: "rgba(15,23,42,0.08)",
};

// ─── Animated Card ────────────────────────────────────────────────────────────
function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, delay: index * 60, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 350, delay: index * 60, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

// ─── Pulsing dot for active status ───────────────────────────────────────────
function PulseDot() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, { toValue: 2.0, duration: 900, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0, duration: 900, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.pulseDotWrapper}>
      <Animated.View style={[styles.pulseDotRing, { transform: [{ scale }], opacity }]} />
      <View style={styles.pulseDotCore} />
    </View>
  );
}

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

  // ─── Core Logic (unchanged) ──────────────────────────────────────────────
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
          (a: SOSItem, b: SOSItem) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
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

  const getDisplayedItems = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sosHistory.slice(startIndex, startIndex + PAGE_SIZE);
  };

  const totalPages = Math.ceil(sosHistory.length / PAGE_SIZE);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [];
    const prev = currentPage - 1;
    const next = currentPage + 1;
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, prev); i <= Math.min(totalPages - 1, next); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
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
      if (currentSound) { currentSound.stop(() => currentSound.release()); setCurrentSound(null); }
      setPlayingAudioId(null);
      return;
    }
    if (currentSound) currentSound.stop(() => currentSound.release());
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

  // ─── Render Media ────────────────────────────────────────────────────────
  const renderMedia = (media: MediaItem[], sosId: string, isExpanded: boolean) => {
    if (!media || media.length === 0) return null;
    const photos = media.filter((m) => m.type === "photo");
    const audios = media.filter((m) => m.type === "audio");
    const isPlaying = playingAudioId === sosId;

    return (
      <View style={styles.mediaWrapper}>
        <TouchableOpacity
          style={[styles.expandButton, isExpanded && styles.expandButtonOpen]}
          onPress={() => toggleExpand(sosId)}
          activeOpacity={0.7}
        >
          <View style={styles.expandLeft}>
            <View style={[styles.expandIconBox, isExpanded && styles.expandIconBoxOpen]}>
              <Text style={styles.expandIcon}>{isExpanded ? "▾" : "▸"}</Text>
            </View>
            <Text style={styles.expandLabel}>{isExpanded ? "Hide Media" : "View Media"}</Text>
            
          </View>
          <View style={styles.mediaTotalBadge}>
            <Text style={styles.mediaTotalBadgeText}>{media.length}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.mediaContent}>
            {photos.length > 0 && (
              <View style={styles.mediaSection}>
                <View style={styles.mediaSectionHeader}>
                  <Text style={styles.mediaSectionTitle}>PHOTOS</Text>
                  <View style={styles.mediaSectionCount}>
                    <Text style={styles.mediaSectionCountText}>{photos.length}</Text>
                  </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoRow}>
                  {photos.map((m) => (
                    <View key={m.id} style={styles.photoWrapper}>
                      <Image source={{ uri: m.url }} style={styles.mediaPhoto} />
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
            {audios.length > 0 && (
              <View style={styles.mediaSection}>
                <View style={styles.mediaSectionHeader}>
                  <Text style={styles.mediaSectionTitle}>RECORDINGS</Text>
                  <View style={styles.mediaSectionCount}>
                    <Text style={styles.mediaSectionCountText}>{audios.length}</Text>
                  </View>
                </View>
                {audios.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.audioButton, isPlaying && styles.audioButtonPlaying]}
                    onPress={() => playAudio(m.url, sosId)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.audioIconCircle, isPlaying && styles.audioIconCirclePlaying]}>
                      <Text style={[styles.audioIcon, isPlaying && styles.audioIconPlaying]}>
                        {isPlaying ? "■" : "▶"}
                      </Text>
                    </View>
                    <View style={styles.audioMeta}>
                      <Text style={[styles.audioLabel, isPlaying && styles.audioLabelPlaying]}>
                        {isPlaying ? "Now Playing" : "Play Recording"}
                      </Text>
                      {m.duration ? <Text style={styles.audioDuration}>{m.duration}s</Text> : null}
                    </View>
                    {isPlaying && (
                      <View style={styles.audioWaveform}>
                        {[8, 14, 10, 18, 12, 7, 16].map((h, i) => (
                          <View key={i} style={[styles.audioWaveBar, { height: h }]} />
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  // ─── Render Item ─────────────────────────────────────────────────────────
  const renderItem = ({ item, index }: { item: SOSItem; index: number }) => {
    const isExpanded = expandedIds.includes(item.id);
    const isActive = item.status === "active";
    const date = new Date(item.timestamp);
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    const globalIndex = (currentPage - 1) * PAGE_SIZE + index + 1;
    const hasMedia = item.media && item.media.length > 0;

    return (
      <AnimatedCard index={index}>
        <View style={[styles.card, isActive && styles.cardActive]}>
          {isActive && <View style={styles.cardActiveStrip} />}

          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.indexBadge, isActive && styles.indexBadgeActive]}>
                <Text style={[styles.indexBadgeText, isActive && styles.indexBadgeTextActive]}>
                  {globalIndex}
                </Text>
              </View>
              <View style={[styles.statusPill, isActive ? styles.statusPillActive : styles.statusPillResolved]}>
                {isActive ? <PulseDot /> : <View style={styles.statusDotStatic} />}
                <Text style={[styles.statusText, { color: isActive ? C.accentText : C.textMuted }]}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.cardHeaderRight}>
              <Text style={styles.dateText}>{dateStr}</Text>
              <Text style={styles.timeText}>{timeStr}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Coords */}
          <View style={styles.coordsRow}>
            <Text style={styles.coordsPin}>📍</Text>
            <Text style={styles.coordsText}>
              {item.location.lat.toFixed(5)}, {item.location.lng.toFixed(5)}
            </Text>
          </View>

          {/* Map */}
          <TouchableOpacity onPress={() => openMap(item.location.lat, item.location.lng)} activeOpacity={0.88}>
            <View style={styles.mapContainer}>
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
              <View style={styles.mapOverlay}>
                <Text style={styles.mapOverlayIcon}>↗</Text>
                <Text style={styles.mapOverlayText}>Open in Maps</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Media or placeholder */}
          {hasMedia ? renderMedia(item.media, item.id, isExpanded) : (
            <View style={styles.noMediaRow}>
              <Text style={styles.noMediaText}>No media attached</Text>
            </View>
          )}
        </View>
      </AnimatedCard>
    );
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingRing}>
          <ActivityIndicator size="large" color={C.accentBright} />
        </View>
        <Text style={styles.loadingTitle}>Loading History</Text>
        <Text style={styles.loadingSubtitle}>Fetching your SOS records…</Text>
      </View>
    );
  }

  // ─── Empty ────────────────────────────────────────────────────────────────
  if (sosHistory.length === 0) {
    return (
      <View style={styles.center}>
        <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
        <View style={styles.emptyIconContainer}>
          <Text style={styles.emptyIconText}>🛡️</Text>
        </View>
        <Text style={styles.emptyTitle}>All Clear</Text>
        <Text style={styles.emptySubtitle}>No emergency alerts have been triggered yet</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchSOSHistory}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Main ─────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerEyebrow}>EMERGENCY LOG</Text>
            <Text style={styles.headerTitle}>SOS History</Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{sosHistory.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxAccent]}>
              <Text style={[styles.statValue, styles.statValueAccent]}>
                {sosHistory.filter((s) => s.status === "active").length}
              </Text>
              <Text style={[styles.statLabel, styles.statLabelAccent]}>Active</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerDivider} />
        <View style={styles.headerMeta}>
          <Text style={styles.headerMetaText}>
            Page {currentPage} of {totalPages} · {getDisplayedItems().length} shown
          </Text>
          <TouchableOpacity onPress={fetchSOSHistory} style={styles.refreshIconBtn}>
            <Text style={styles.refreshIconText}>⟳</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={getDisplayedItems()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.navBtn, currentPage === 1 && styles.navBtnDisabled]}
            onPress={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            activeOpacity={0.75}
          >
            <Text style={[styles.navBtnText, currentPage === 1 && styles.navBtnTextDisabled]}>‹</Text>
          </TouchableOpacity>

          <View style={styles.pageNumbers}>
            {getVisiblePages().map((page, idx) =>
              page === "..." ? (
                <Text key={`dots-${idx}`} style={styles.dots}>···</Text>
              ) : (
                <TouchableOpacity
                  key={page}
                  style={[styles.pageBtn, currentPage === page && styles.pageBtnActive]}
                  onPress={() => goToPage(Number(page))}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.pageBtnText, currentPage === page && styles.pageBtnTextActive]}>
                    {page}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          <TouchableOpacity
            style={[styles.navBtn, currentPage === totalPages && styles.navBtnDisabled]}
            onPress={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            activeOpacity={0.75}
          >
            <Text style={[styles.navBtnText, currentPage === totalPages && styles.navBtnTextDisabled]}>›</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  center: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: C.bg, padding: 32, gap: 12,
  },

  // ── Loading ───────────────────────────────────────────────────────────────
  loadingRing: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: C.accentSoft,
    justifyContent: "center", alignItems: "center",
    marginBottom: 8, borderWidth: 1.5, borderColor: C.accentMuted,
    shadowColor: C.accentBright, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 12, elevation: 4,
  },
  loadingTitle: { fontSize: 20, fontWeight: "700", color: C.textPrimary, letterSpacing: 0.2 },
  loadingSubtitle: { fontSize: 14, color: C.textMuted },

  // ── Empty ─────────────────────────────────────────────────────────────────
  emptyIconContainer: {
    width: 104, height: 104, borderRadius: 52,
    backgroundColor: C.surface,
    justifyContent: "center", alignItems: "center",
    marginBottom: 8, borderWidth: 1.5, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 16, elevation: 4,
  },
  emptyIconText: { fontSize: 46 },
  emptyTitle: { fontSize: 24, fontWeight: "800", color: C.textPrimary, letterSpacing: -0.3 },
  emptySubtitle: { fontSize: 15, color: C.textSecondary, textAlign: "center", lineHeight: 22 },
  refreshButton: {
    marginTop: 10, paddingHorizontal: 28, paddingVertical: 12,
    backgroundColor: C.surface, borderRadius: 12,
    borderWidth: 1.5, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  refreshButtonText: { color: C.textSecondary, fontSize: 14, fontWeight: "600" },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    backgroundColor: C.surface,
    borderBottomWidth: 1, borderBottomColor: C.border,
    paddingTop: 54, paddingHorizontal: 20, paddingBottom: 0,
    // Subtle drop shadow
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 4,
  },
  headerTop: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "flex-end", paddingBottom: 14,
  },
  headerEyebrow: {
    fontSize: 10, fontWeight: "800", color: C.accentBright,
    letterSpacing: 2.5, marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28, fontWeight: "800", color: C.textPrimary, letterSpacing: -0.5,
  },
  headerStats: { flexDirection: "row", gap: 8 },
  statBox: {
    backgroundColor: C.surfaceAlt, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 9,
    alignItems: "center", borderWidth: 1, borderColor: C.border, minWidth: 62,
  },
  statBoxAccent: { backgroundColor: C.accentSoft, borderColor: C.accentMuted },
  statValue: { fontSize: 20, fontWeight: "800", color: C.textPrimary },
  statValueAccent: { color: C.accentText },
  statLabel: { fontSize: 10, fontWeight: "600", color: C.textMuted, letterSpacing: 0.5, marginTop: 1 },
  statLabelAccent: { color: C.accentText, opacity: 0.7 },
  headerDivider: { height: 1, backgroundColor: C.border },
  headerMeta: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingVertical: 10,
  },
  headerMetaText: { fontSize: 12, color: C.textMuted, letterSpacing: 0.2 },
  refreshIconBtn: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: C.surfaceAlt, borderWidth: 1, borderColor: C.border,
    justifyContent: "center", alignItems: "center",
  },
  refreshIconText: { fontSize: 17, color: C.textSecondary, fontWeight: "700" },

  // ── List ──────────────────────────────────────────────────────────────────
  listContent: { padding: 16, paddingTop: 14 },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: C.surface, borderRadius: 20, overflow: "hidden",
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 3,
  },
  cardActive: {
    borderColor: C.accentMuted,
    shadowColor: C.accentBright, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 16, elevation: 6,
  },
  cardActiveStrip: { height: 3.5, backgroundColor: C.accentBright },

  // Card header
  cardHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14,
  },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardHeaderRight: { alignItems: "flex-end", gap: 2 },

  indexBadge: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: C.surfaceAlt, justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: C.border,
  },
  indexBadgeActive: { backgroundColor: C.accentSoft, borderColor: C.accentMuted },
  indexBadgeText: { fontSize: 12, fontWeight: "800", color: C.textMuted },
  indexBadgeTextActive: { color: C.accentText },

  statusPill: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, gap: 7,
  },
  statusPillActive: { backgroundColor: C.accentSoft, borderWidth: 1.5, borderColor: C.accentMuted },
  statusPillResolved: { backgroundColor: C.surfaceAlt, borderWidth: 1, borderColor: C.border },

  // Pulse dot
  pulseDotWrapper: { width: 10, height: 10, justifyContent: "center", alignItems: "center" },
  pulseDotRing: {
    position: "absolute", width: 10, height: 10,
    borderRadius: 5, backgroundColor: C.accentBright,
  },
  pulseDotCore: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.accentBright },
  statusDotStatic: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.statusResolved },
  statusText: { fontSize: 10, fontWeight: "800", letterSpacing: 1.2 },

  dateText: { fontSize: 13, fontWeight: "600", color: C.textSecondary },
  timeText: { fontSize: 11, color: C.textMuted, letterSpacing: 0.2 },

  divider: { height: 1, backgroundColor: C.borderSubtle, marginHorizontal: 16 },

  // Coords
  coordsRow: {
    flexDirection: "row", alignItems: "center",
    gap: 6, paddingHorizontal: 16, paddingVertical: 10,
  },
  coordsPin: { fontSize: 12 },
  coordsText: {
    fontSize: 12, color: C.textMuted,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    letterSpacing: 0.3,
  },

  // Map
  mapContainer: {
    marginHorizontal: 14, marginBottom: 14, borderRadius: 16,
    overflow: "hidden", borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  map: { width: "100%", height: 160 },
  mapOverlay: {
    position: "absolute", bottom: 10, right: 10,
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 9, paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 4, elevation: 2,
  },
  mapOverlayIcon: { color: C.blue, fontSize: 13, fontWeight: "800" },
  mapOverlayText: { color: C.blue, fontSize: 12, fontWeight: "700" },

  // No media
  noMediaRow: {
    marginHorizontal: 14, marginBottom: 14,
    paddingVertical: 10, paddingHorizontal: 14,
    backgroundColor: C.surfaceAlt, borderRadius: 10,
    borderWidth: 1, borderColor: C.borderSubtle, borderStyle: "dashed",
  },
  noMediaText: { fontSize: 12, color: C.textDim, textAlign: "center" },

  // ── Media ─────────────────────────────────────────────────────────────────
  mediaWrapper: { marginHorizontal: 14, marginBottom: 14, gap: 8 },
  expandButton: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: C.surfaceAlt, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 11,
    borderWidth: 1.5, borderColor: C.border,
  },
  expandButtonOpen: { borderColor: C.blue, backgroundColor: C.blueLight },
  expandLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  expandIconBox: {
    width: 24, height: 24, borderRadius: 7,
    backgroundColor: C.blueSoft, justifyContent: "center", alignItems: "center",
  },
  expandIconBoxOpen: { backgroundColor: "rgba(37,99,235,0.14)" },
  expandIcon: { color: C.blue, fontSize: 13, fontWeight: "700" },
  expandLabel: { color: C.blue, fontSize: 13, fontWeight: "700" },
  mediaTypePill: {
    backgroundColor: C.blueSoft, borderRadius: 7,
    paddingHorizontal: 7, paddingVertical: 2,
    borderWidth: 1, borderColor: C.blueDim,
  },
  mediaTypePillText: { fontSize: 11, color: C.blue, fontWeight: "600" },
  mediaTotalBadge: {
    width: 26, height: 26, borderRadius: 7,
    backgroundColor: C.blueSoft, justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: C.blueDim,
  },
  mediaTotalBadgeText: { color: C.blue, fontSize: 12, fontWeight: "800" },
  mediaContent: { gap: 12, paddingTop: 4 },
  mediaSection: { gap: 8 },
  mediaSectionHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  mediaSectionTitle: {
    fontSize: 10, fontWeight: "800", color: C.textMuted, letterSpacing: 1.8,
  },
  mediaSectionCount: {
    backgroundColor: C.surfaceHover, borderRadius: 5,
    paddingHorizontal: 6, paddingVertical: 1,
    borderWidth: 1, borderColor: C.border,
  },
  mediaSectionCountText: { fontSize: 10, fontWeight: "700", color: C.textMuted },
  photoRow: { paddingBottom: 4, gap: 8 },
  photoWrapper: {
    borderRadius: 12, overflow: "hidden",
    borderWidth: 1, borderColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  mediaPhoto: { width: 100, height: 100, backgroundColor: C.surfaceAlt },

  audioButton: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.surfaceAlt, borderRadius: 14,
    padding: 12, borderWidth: 1.5, borderColor: C.border, gap: 12,
  },
  audioButtonPlaying: { backgroundColor: C.accentSoft, borderColor: C.accentMuted },
  audioIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.blueSoft, borderWidth: 1.5, borderColor: C.blueDim,
    justifyContent: "center", alignItems: "center",
  },
  audioIconCirclePlaying: { backgroundColor: C.accentSoft, borderColor: C.accentMuted },
  audioIcon: { fontSize: 11, color: C.blue, fontWeight: "900" },
  audioIconPlaying: { color: C.accentBright },
  audioMeta: { flex: 1, gap: 2 },
  audioLabel: { fontSize: 14, fontWeight: "700", color: C.textPrimary },
  audioLabelPlaying: { color: C.accentText },
  audioDuration: { fontSize: 12, color: C.textMuted },
  audioWaveform: { flexDirection: "row", alignItems: "center", gap: 3, paddingRight: 4 },
  audioWaveBar: { width: 3, backgroundColor: C.accentBright, borderRadius: 2, opacity: 0.7 },

  // ── Pagination ────────────────────────────────────────────────────────────
  pagination: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 4,
  },
  navBtn: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: C.blue, justifyContent: "center", alignItems: "center",
    shadowColor: C.blue, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  navBtnDisabled: {
    backgroundColor: C.surfaceAlt, borderWidth: 1, borderColor: C.border,
    shadowOpacity: 0, elevation: 0,
  },
  navBtnText: { color: C.white, fontSize: 22, fontWeight: "700", lineHeight: 24 },
  navBtnTextDisabled: { color: C.textMuted },
  pageNumbers: { flexDirection: "row", alignItems: "center", gap: 6 },
  pageBtn: {
    width: 38, height: 38, borderRadius: 10,
    justifyContent: "center", alignItems: "center",
    backgroundColor: C.surfaceAlt, borderWidth: 1, borderColor: C.border,
  },
  pageBtnActive: {
    backgroundColor: C.accentBright, borderColor: C.accentBright,
    shadowColor: C.accentBright, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22, shadowRadius: 6, elevation: 3,
  },
  pageBtnText: { fontSize: 14, fontWeight: "700", color: C.textSecondary },
  pageBtnTextActive: { color: C.white },
  dots: { fontSize: 14, color: C.textMuted, letterSpacing: 2, paddingHorizontal: 2 },
});