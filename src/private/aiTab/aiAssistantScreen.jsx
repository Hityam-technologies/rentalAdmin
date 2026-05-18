import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Platform,
    StatusBar,
    StyleSheet,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/header';
import AppText from '../../components/appText';
import AiChatMessage from '../../components/aiChatMessage';
import { colors } from '../../assets/colors';
import {
    INITIAL_MESSAGES,
    SUGGESTED_PROMPTS,
    ASSISTANT_NAME,
    ASSISTANT_TAGLINE,
    processUserMessage,
    executeConfirmedAction,
} from '../../services/aiAssistantEngine';

const TYPING_ID = 'typing-indicator';
/** Extra lift so the input bar clears the keyboard toolbar on Android */
const KEYBOARD_EXTRA_OFFSET = Platform.OS === 'android' ? 24 : 12;

const AiAssistantScreen = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const flatListRef = useRef(null);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [permissionBusy, setPermissionBusy] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const initialPrompt = route?.params?.initialPrompt;

    const scrollToEnd = useCallback(() => {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, []);

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const onShow = (event) => {
            setKeyboardHeight(event.endCoordinates.height);
            scrollToEnd();
        };
        const onHide = () => setKeyboardHeight(0);

        const showSub = Keyboard.addListener(showEvent, onShow);
        const hideSub = Keyboard.addListener(hideEvent, onHide);

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, [scrollToEnd]);

    useEffect(() => {
        if (initialPrompt) {
            handleSend(initialPrompt);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialPrompt]);

    const inputBarBottomPadding =
        keyboardHeight > 0
            ? Platform.OS === 'android'
                ? keyboardHeight + KEYBOARD_EXTRA_OFFSET
                : Math.max(keyboardHeight - insets.bottom, 8) + KEYBOARD_EXTRA_OFFSET
            : Math.max(insets.bottom, 12);

    const runNavigation = useCallback(
        (nav) => {
            if (!nav?.screen) return;
            try {
                navigation.navigate(nav.screen, nav.params);
            } catch (e) {
                navigation.getParent()?.navigate(nav.screen, nav.params);
            }
        },
        [navigation],
    );

    const appendMessages = useCallback((items) => {
        setMessages((prev) => [...prev, ...items.filter(Boolean)]);
        scrollToEnd();
    }, [scrollToEnd]);

    const handleSend = useCallback(
        (textOverride) => {
            const text = (textOverride ?? input).trim();
            if (!text || isThinking) return;

            setInput('');
            setIsThinking(true);

            const { userMessage, assistantMessage } = processUserMessage(text);
            appendMessages([userMessage]);

            setMessages((prev) => [...prev, { id: TYPING_ID, role: 'typing' }]);
            scrollToEnd();

            const delay = 500 + Math.min(text.length * 8, 900);
            setTimeout(() => {
                setMessages((prev) => prev.filter((m) => m.id !== TYPING_ID));
                const enriched = {
                    ...assistantMessage,
                    permissionResolved: false,
                };
                appendMessages([enriched]);
                setIsThinking(false);

                if (assistantMessage.autoNavigate) {
                    const { screen, params, delayMs } = assistantMessage.autoNavigate;
                    setTimeout(() => runNavigation({ screen, params }), delayMs || 600);
                }
            }, delay);
        },
        [input, isThinking, appendMessages, scrollToEnd, runNavigation],
    );

    const handleActionPress = useCallback(
        (action) => {
            if (action.prompt) {
                handleSend(action.prompt);
                return;
            }
            if (action.navigate) {
                runNavigation(action.navigate);
            }
        },
        [handleSend, runNavigation],
    );

    const handlePermissionConfirm = useCallback(
        (message) => {
            const { permission } = message;
            if (!permission || permissionBusy) return;

            Alert.alert(
                permission.title,
                `${permission.body}\n\nThis action will be logged. Continue?`,
                [
                    { text: permission.cancelLabel || 'Cancel', style: 'cancel' },
                    {
                        text: permission.confirmLabel || 'Confirm',
                        style: 'default',
                        onPress: () => {
                            setPermissionBusy(true);
                            setMessages((prev) =>
                                prev.map((m) =>
                                    m.id === message.id ? { ...m, permissionResolved: true } : m,
                                ),
                            );

                            setTimeout(() => {
                                const followUp = executeConfirmedAction(
                                    permission.actionType,
                                    permission.payload,
                                );
                                appendMessages([followUp]);
                                setPermissionBusy(false);
                            }, 400);
                        },
                    },
                ],
            );
        },
        [permissionBusy, appendMessages],
    );

    const handlePermissionCancel = useCallback((message) => {
        setMessages((prev) =>
            prev.map((m) =>
                m.id === message.id ? { ...m, permissionResolved: true } : m,
            ),
        );
        appendMessages([
            {
                id: `cancel-${Date.now()}`,
                role: 'assistant',
                text: 'No problem — I cancelled that. Let me know if you want to try something else.',
                createdAt: Date.now(),
            },
        ]);
    }, [appendMessages]);

    const renderHeader = () => (
        <View className="px-1 pb-2">
            <LinearGradient
                colors={['#1e1b4b', '#312e81', '#0f172a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroCard}
            >
                <View className="flex-row items-center">
                    <LinearGradient
                        colors={['#a855f7', '#6366f1', '#004f8f']}
                        style={styles.heroIcon}
                    >
                        <Ionicons name="sparkles" size={22} color="#FFFFFF" />
                    </LinearGradient>
                    <View className="flex-1 ml-3">
                        <AppText weight="bold" className="text-white text-[16px]">
                            {ASSISTANT_NAME}
                        </AppText>
                        <AppText weight="medium" className="text-white/60 text-[12px] mt-0.5">
                            {ASSISTANT_TAGLINE}
                        </AppText>
                    </View>
                    <View className="px-2 py-1 rounded-lg" style={{ backgroundColor: 'rgba(16,185,129,0.25)' }}>
                        <AppText weight="bold" className="text-[10px] text-emerald-300">
                            LIVE
                        </AppText>
                    </View>
                </View>
                <AppText weight="medium" className="text-white/50 text-[11px] mt-3 leading-4">
                    Analysis · Navigation · Confirmed actions
                </AppText>
            </LinearGradient>

            <AppText weight="bold" className="text-[11px] text-slate-400 uppercase tracking-wider mt-4 mb-2">
                Suggestions
            </AppText>
            <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                {SUGGESTED_PROMPTS.map((prompt) => (
                    <TouchableOpacity
                        key={prompt}
                        activeOpacity={0.85}
                        onPress={() => handleSend(prompt)}
                        disabled={isThinking}
                        className="rounded-full px-3 py-2 border border-slate-200 bg-white"
                    >
                        <AppText weight="medium" className="text-[12px] text-slate-700">
                            {prompt}
                        </AppText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-slate-50">
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
            <Header
                title="AI Assistant"
                subtitle="Hityam Fleet Admin"
                showBackButton
                onBackPress={() => navigation.goBack()}
            />

            <View className="flex-1">
                <FlatList
                    ref={flatListRef}
                    style={{ flex: 1 }}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AiChatMessage
                            message={item}
                            onActionPress={handleActionPress}
                            onPermissionConfirm={handlePermissionConfirm}
                            onPermissionCancel={handlePermissionCancel}
                            permissionBusy={permissionBusy}
                        />
                    )}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingTop: 12,
                        paddingBottom: keyboardHeight > 0 ? 12 : 16,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    onContentSizeChange={scrollToEnd}
                />

                <View
                    className="px-4 pt-3"
                    style={{ paddingBottom: inputBarBottomPadding }}
                >
                    <View className="flex-row items-end rounded-2xl border border-slate-200 bg-white px-3 py-2">
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            placeholder="Ask anything or say 'open fleet'…"
                            placeholderTextColor="#94a3b8"
                            multiline
                            maxLength={500}
                            editable={!isThinking}
                            className="flex-1 text-[14px] text-slate-900 max-h-24 py-2"
                            style={{ fontFamily: 'Manrope-Medium' }}
                            onSubmitEditing={() => handleSend()}
                            blurOnSubmit={false}
                            onFocus={scrollToEnd}
                        />
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => handleSend()}
                            disabled={!input.trim() || isThinking}
                            style={{ opacity: !input.trim() || isThinking ? 0.45 : 1 }}
                        >
                            <LinearGradient
                                colors={['#0066b8', '#004f8f']}
                                style={styles.sendBtn}
                            >
                                <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    {keyboardHeight === 0 ? (
                        <AppText weight="medium" className="text-[10px] text-slate-400 text-center mt-2">
                            Destructive changes require your confirmation
                        </AppText>
                    ) : null}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    heroCard: {
        borderRadius: 20,
        padding: 16,
    },
    heroIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
});

export default AiAssistantScreen;
