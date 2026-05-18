import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import AppText from './appText';
import { colors } from '../assets/colors';
import { ASSISTANT_NAME } from '../services/aiAssistantEngine';

const MetricRow = ({ metrics }) => (
    <View className="mt-3 flex-row flex-wrap" style={{ gap: 8 }}>
        {metrics.map((m, i) => (
            <View
                key={i}
                className="rounded-2xl px-3 py-2 border border-slate-200/80 bg-slate-50"
                style={{ minWidth: '30%', flexGrow: 1 }}
            >
                <AppText weight="bold" className="text-[10px] text-slate-400 uppercase tracking-wide">
                    {m.label}
                </AppText>
                <AppText weight="bold" className="text-[15px] text-slate-900 mt-0.5">
                    {m.value}
                </AppText>
                {m.sub ? (
                    <AppText weight="medium" className="text-[11px] text-slate-500 mt-0.5">
                        {m.sub}
                    </AppText>
                ) : null}
            </View>
        ))}
    </View>
);

const ActionButtons = ({ actions, onActionPress }) => {
    if (!actions?.length) return null;
    return (
        <View className="mt-3 flex-row flex-wrap" style={{ gap: 8 }}>
            {actions.map((action) => (
                <TouchableOpacity
                    key={action.id}
                    activeOpacity={0.85}
                    onPress={() => onActionPress(action)}
                    className="flex-row items-center rounded-xl px-3 py-2 border border-primary/20"
                    style={{ backgroundColor: '#e0edff' }}
                >
                    {action.icon ? (
                        <Ionicons name={action.icon} size={14} color={colors.primary} style={{ marginRight: 6 }} />
                    ) : null}
                    <AppText weight="bold" className="text-[12px]" style={{ color: colors.primary }}>
                        {action.label}
                    </AppText>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export const PermissionCard = ({ permission, onConfirm, onCancel, disabled }) => (
    <View
        className="mt-3 rounded-2xl p-4 border-2"
        style={{ borderColor: colors.primary, backgroundColor: '#f0f7ff' }}
    >
        <View className="flex-row items-center mb-2">
            <Ionicons name="shield-checkmark" size={18} color={colors.primary} />
            <AppText weight="bold" className="text-[13px] text-slate-900 ml-2">
                {permission.title}
            </AppText>
        </View>
        <AppText weight="medium" className="text-[13px] text-slate-600 leading-5">
            {permission.body}
        </AppText>
        <View className="flex-row mt-3" style={{ gap: 10 }}>
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={onCancel}
                disabled={disabled}
                className="flex-1 py-3 rounded-xl items-center border border-slate-300 bg-white"
            >
                <AppText weight="bold" className="text-[13px] text-slate-600">
                    {permission.cancelLabel || 'Cancel'}
                </AppText>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={onConfirm}
                disabled={disabled}
                className="flex-1 py-3 rounded-xl items-center overflow-hidden"
                style={{ backgroundColor: colors.primary, opacity: disabled ? 0.6 : 1 }}
            >
                <AppText weight="bold" className="text-[13px] text-white">
                    {permission.confirmLabel || 'Confirm'}
                </AppText>
            </TouchableOpacity>
        </View>
    </View>
);

const AiChatMessage = ({ message, onActionPress, onPermissionConfirm, onPermissionCancel, permissionBusy }) => {
    const isUser = message.role === 'user';
    const isTyping = message.role === 'typing';

    if (isTyping) {
        return (
            <View className="flex-row items-end mb-4 px-1">
                <AssistantAvatar />
                <View className="ml-2 rounded-2xl rounded-bl-md px-4 py-3 bg-white border border-slate-200/80">
                    <AppText weight="medium" className="text-[13px] text-slate-400">
                        Thinking…
                    </AppText>
                </View>
            </View>
        );
    }

    return (
        <View className={`mb-4 px-1 ${isUser ? 'items-end' : 'items-start'}`}>
            <View className={`flex-row max-w-[92%] ${isUser ? 'flex-row-reverse' : ''}`}>
                {!isUser ? <AssistantAvatar /> : null}
                <View className={isUser ? 'mr-0 ml-0' : 'ml-2'} style={{ flex: 1, maxWidth: '100%' }}>
                    {!isUser ? (
                        <AppText weight="bold" className="text-[10px] text-slate-400 mb-1 ml-1">
                            {ASSISTANT_NAME}
                        </AppText>
                    ) : null}
                    <View
                        style={[
                            styles.bubble,
                            isUser ? styles.userBubble : styles.assistantBubble,
                        ]}
                    >
                        <AppText
                            weight="medium"
                            className={`text-[14px] leading-[22px] ${isUser ? 'text-white' : 'text-slate-800'}`}
                        >
                            {message.text}
                        </AppText>
                        {message.metrics ? <MetricRow metrics={message.metrics} /> : null}
                        {message.actions ? (
                            <ActionButtons actions={message.actions} onActionPress={onActionPress} />
                        ) : null}
                        {message.permission && !message.permissionResolved ? (
                            <PermissionCard
                                permission={message.permission}
                                onConfirm={() => onPermissionConfirm(message)}
                                onCancel={() => onPermissionCancel(message)}
                                disabled={permissionBusy}
                            />
                        ) : null}
                    </View>
                </View>
            </View>
        </View>
    );
};

const AssistantAvatar = () => (
    <LinearGradient
        colors={['#6366f1', '#004f8f']}
        style={styles.avatar}
    >
        <Ionicons name="sparkles" size={16} color="#FFFFFF" />
    </LinearGradient>
);

const styles = StyleSheet.create({
    bubble: {
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    userBubble: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: 6,
    },
    assistantBubble: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.9)',
        borderBottomLeftRadius: 6,
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AiChatMessage;
