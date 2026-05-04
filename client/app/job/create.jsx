import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView,
    Modal
} from 'react-native';
import { Alert } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import { Colors, FontSizes, Spacing, Radius } from "../constants/theme";
import LeafletLocationPicker from '../components/LeafletMap';
import { useRouter } from 'expo-router';



export default function create(){
    const router = useRouter();
    
    const [isChecked, setChecked] = useState(false);
    const [jobLocation, setJobLocation] = useState(null);
    const [jobTitle, setJobTitle] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobReward, setJobReward] = useState("");
    const [paymentMethod, setPaymentMethod] = useState('gcash'); // default to gcash
    const [isModalVisible, setIsModalVisible] = useState(false)

    const baseReward = parseFloat(jobReward) || 0;
    const urgentFee = isChecked ? 50 : 0;
    const totalAmount = baseReward + urgentFee;
    
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
                        value={jobTitle}
                        onChangeText={setJobTitle}
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
                        value={jobDescription}
                        onChangeText={setJobDescription}
                    />
                </View>

                <LeafletLocationPicker onLocationSelect={setJobLocation} />

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Reward</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder={paymentMethod === 'gcash' ? "e.g. ₱500" : "Enter amount"} 
                        placeholderTextColor={Colors.textMuted}
                        value={jobReward}
                        onChangeText={setJobReward}
                        keyboardType="numeric"
                    />

                    {/* The Trigger Button */}
                    <TouchableOpacity 
                        style={styles.methodTrigger} 
                        onPress={() => setIsModalVisible(true)}
                    >
                        <Text style={styles.methodTriggerLabel}>Payment Method</Text>
                        <View style={styles.methodValueRow}>
                            <Text style={styles.methodValueText}>
                                {paymentMethod === 'gcash' ? 'GCash' : 'Credit/Debit Card'}
                            </Text>
                            {/* You can add a small chevron icon here */}
                            <Text style={{color: Colors.textSecondary}}> ⌄ </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Bottom Selection Modal */}
                    <Modal
                        visible={isModalVisible}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setIsModalVisible(false)}
                    >
                        <TouchableOpacity 
                            style={styles.modalOverlay} 
                            activeOpacity={1} 
                            onPress={() => setIsModalVisible(false)}
                        >
                            <View style={styles.modalContent}>
                                <View style={styles.modalHandle} />
                                <Text style={styles.modalTitle}>Select Payment Method</Text>
                                
                                <TouchableOpacity 
                                    style={styles.modalOption} 
                                    onPress={() => { setPaymentMethod('gcash'); setIsModalVisible(false); }}
                                >
                                    <Text style={[styles.optionText, paymentMethod === 'gcash' && styles.optionTextActive]}>GCash</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.modalOption} 
                                    onPress={() => { setPaymentMethod('card'); setIsModalVisible(false); }}
                                >
                                    <Text style={[styles.optionText, paymentMethod === 'card' && styles.optionTextActive]}>Credit/Debit Card</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </Modal>
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

                <View style={styles.subtotalContainer}>
                    <Text style={styles.subtotalTitle}>Payment Summary</Text>
                    
                    <View style={styles.subtotalRow}>
                        <Text style={styles.subtotalLabel}>Base Reward</Text>
                        <Text style={styles.subtotalValue}>₱{baseReward.toFixed(2)}</Text>
                    </View>

                    {isChecked && (
                        <View style={styles.subtotalRow}>
                            <Text style={styles.subtotalLabel}>Urgent Fee</Text>
                            <Text style={styles.subtotalValue}>₱50.00</Text>
                        </View>
                    )}

                    <View style={styles.divider} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Estimate</Text>
                        <Text style={styles.totalValue}>₱{totalAmount.toFixed(2)}</Text>
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
        paddingBottom: Spacing.xl * 2, 
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
        textAlignVertical: 'top',
    },

    // --- NEW: Payment Method Trigger ---
    methodTrigger: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginTop: 4, // Slight gap from the TextInput above
    },
    methodTriggerLabel: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
    },
    methodValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    methodValueText: {
        fontSize: FontSizes.sm,
        fontWeight: '700',
        color: Colors.accent, 
    },

    // --- NEW: Bottom Modal Styles ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.background,
        borderTopLeftRadius: Radius.lg,
        borderTopRightRadius: Radius.lg,
        padding: Spacing.lg,
        paddingBottom: Spacing.xl * 2, // Extra space for home indicators/safe area
    },
    modalHandle: {
        width: 40,
        height: 5,
        backgroundColor: Colors.border,
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: Spacing.md,
    },
    modalTitle: {
        fontSize: FontSizes.md,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    modalOption: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        alignItems: 'center',
    },
    optionText: {
        fontSize: FontSizes.md,
        color: Colors.textPrimary,
        fontWeight: '500',
    },
    optionTextActive: {
        color: Colors.accent,
        fontWeight: '700',
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
        backgroundColor: "rgba(255, 77, 77, 0.1)",
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
        elevation: 2,
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    submitBtnText: {
        color: "#FFFFFF",
        fontSize: FontSizes.md,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    subtotalContainer: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        marginTop: Spacing.sm,
        gap: Spacing.sm,
    },
    subtotalTitle: {
        fontSize: FontSizes.sm,
        fontWeight: "700",
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    subtotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subtotalLabel: {
        fontSize: FontSizes.sm,
        color: Colors.textSecondary,
    },
    subtotalValue: {
        fontSize: FontSizes.sm,
        color: Colors.textPrimary,
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.xs,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 2,
    },
    totalLabel: {
        fontSize: FontSizes.md,
        fontWeight: "800",
        color: Colors.textPrimary,
    },
    totalValue: {
        fontSize: FontSizes.lg,
        fontWeight: "800",
        color: Colors.accent, 
    },
});

