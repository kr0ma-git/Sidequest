import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView 
} from 'react-native';
import { Alert } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import { Colors, FontSizes, Spacing, Radius } from "../constants/theme";
import LeafletLocationPicker from '../components/LeafletMap';
import { useRouter } from 'expo-router';

const router = useRouter();

export default function create(){
    const [isChecked, setChecked] = useState(false);
    const [jobLocation, setJobLocation] = useState(null);
    const urgentCheck = (newValue) => {
        setChecked(newValue);

        if(newValue){
            Alert.alert("Urgent", "An additional P50 fee will be added to your listing for it to be marked as urgent. Are you sure you want to proceed?", [
                {
                    text: "Cancel",
                    onPress: () => setChecked(false),
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => setChecked(true)
                }
            ])
        }
    }

    return (<>
        { /* header */}
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            
            {/* Header */}
            <View style={styles.headerWrap}> 
                <Text style={styles.title}>Create a Job</Text>
                <Text style={styles.subtitle}>Make a job listing for others to do</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Job Title</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="e.g. Need help moving boxes" 
                        placeholderTextColor={Colors.textMuted}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput 
                        style={[styles.input, styles.textArea]} 
                        placeholder="Describe the tasks required..." 
                        placeholderTextColor={Colors.textMuted}
                        multiline={true}
                        numberOfLines={4}
                    />
                </View>

                <LeafletLocationPicker onLocationSelect={setJobLocation} />

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Reward</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="e.g. ₱500" 
                        placeholderTextColor={Colors.textMuted}
                        keyboardType="numeric"
                    />
                </View>

                {/* Urgent Toggle - Styled like a card */}
                <View style={isChecked ? styles.urgentBoxActive : styles.urgentBox}>
                    <Checkbox
                        value={isChecked}
                        onValueChange={urgentCheck}
                        color={isChecked ? Colors.error : Colors.border} 
                    />
                    <View style={styles.urgentTextWrap}>
                        <Text style={isChecked ? styles.urgentLabelActive : styles.urgentLabel}>
                            Mark as Urgent
                        </Text>
                        <Text style={styles.urgentDesc}>
                            Highlight and prioritize this job in search results
                        </Text>
                    </View>
                </View>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitBtn} onPress={router.back}>
                    <Text style={styles.submitBtnText}>Post Job</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingBottom: Spacing.xl * 2, // Extra padding for scrolling past keyboard
    },
    
    // Header
    headerWrap: {
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        backgroundColor: Colors.background,
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: FontSizes.xl,
        fontWeight: "800",
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
    },

    // Form Elements
    form: {
        paddingHorizontal: Spacing.md,
        gap: Spacing.md, 
    },
    inputGroup: {
        gap: 6,
    },
    label: {
        fontSize: FontSizes.sm,
        fontWeight: "700",
        color: Colors.textPrimary,
        marginLeft: 4,
    },
    input: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: FontSizes.md,
        color: Colors.textPrimary,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top', // Keeps text at the top on Android
    },

    // Urgent Checkbox Area
    urgentBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        marginTop: Spacing.sm,
        gap: Spacing.md,
    },
    urgentBoxActive: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 77, 77, 0.1)", // Subtle red background
        borderWidth: 1,
        borderColor: Colors.error,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        marginTop: Spacing.sm,
        gap: Spacing.md,
    },
    urgentTextWrap: {
        flex: 1,
    },
    urgentLabel: {
        fontSize: FontSizes.md,
        fontWeight: "700",
        color: Colors.textPrimary,
    },
    urgentLabelActive: {
        fontSize: FontSizes.md,
        fontWeight: "800",
        color: Colors.error,
    },
    urgentDesc: {
        fontSize: FontSizes.xs,
        color: Colors.textSecondary,
        marginTop: 2,
    },

    // Submit Button
    submitBtn: {
        backgroundColor: Colors.accent,
        paddingVertical: 16,
        borderRadius: Radius.full,
        alignItems: "center",
        justifyContent: "center",
        marginTop: Spacing.lg,
        elevation: 2, // Slight shadow on Android
        shadowColor: Colors.accent, // Subtle glow on iOS
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    submitBtnText: {
        color: "#FFFFFF", // Or whatever your button text color is
        fontSize: FontSizes.md,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
});


