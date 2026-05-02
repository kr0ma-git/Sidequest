import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors } from '../constants/theme';

export default function LeafletLocationPicker({ onLocationSelect }) {
    const [pinnedLocation, setPinnedLocation] = useState(null);

    // This is the HTML, CSS, and JS that runs INSIDE the WebView
    const leafletHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <style>
                body { padding: 0; margin: 0; }
                html, body, #map { height: 100%; width: 100%; }
            </style>
        </head>
        <body>
            <div id="map"></div>
            <script>
                // Initialize map (e.g., set to London)
                var map = L.map('map').setView([10.3157, 123.8854], 12);
                
                // Load OpenStreetMap tiles
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '© OpenStreetMap'
                }).addTo(map);

                var marker;

                // Listen for map clicks
                map.on('click', function(e) {
                    var lat = e.latlng.lat;
                    var lng = e.latlng.lng;

                    // Place or move the marker
                    if (marker) {
                        marker.setLatLng(e.latlng);
                    } else {
                        marker = L.marker(e.latlng).addTo(map);
                    }

                    // Send data back to React Native
                    window.ReactNativeWebView.postMessage(JSON.stringify({ lat: lat, lng: lng }));
                });
            </script>
        </body>
        </html>
    `;

    // Handle messages sent from the WebView HTML
    const handleWebViewMessage = (event) => {
        const data = JSON.parse(event.nativeEvent.data);
        setPinnedLocation(data);

        if (onLocationSelect) {
            onLocationSelect(data); 
        }
    };

    return (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            
            <View style={styles.mapContainer}>
                <WebView
                    source={{ html: leafletHTML }}
                    onMessage={handleWebViewMessage}
                    scrollEnabled={false} // Prevents the whole webview from scrolling
                />
            </View>

            {pinnedLocation && (
                <Text style={styles.coordsText}>
                    Selected: {pinnedLocation.lat.toFixed(4)}, {pinnedLocation.lng.toFixed(4)}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    inputGroup: { gap: 6, marginBottom: 16 },
    label: { fontSize: 14, fontWeight: "700" },
    mapContainer: {
        height: 200, 
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    coordsText: { fontSize: 12, color: Colors.textSecondary, marginTop: 4 }
});