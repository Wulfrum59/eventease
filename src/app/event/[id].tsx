// src/app/event/[id].tsx
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { ParticipationToggle } from "@/components/events/ParticipationToggle";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useEventMutations } from "@/hooks/useEventMutations";
import { useEvents } from "@/hooks/useEvents";
import { formatEventDate, isPastDate } from "@/utils/date";

export default function EventDetailScreen() {
    // Tous les hooks en haut, avant les return anticipés (règle des hooks)
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const { events, isLoading } = useEvents();
    const { deleteEvent, toggleParticipation } = useEventMutations();

    // On cherche l'événement dans le contexte : toujours la version à jour
    const event = events.find((e) => e.id === id);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    // Id inconnu (événement supprimé, lien obsolète...) : on ne plante pas
    if (!event) {
        return (
            <View style={styles.screen}>
                <EmptyState title="Événement introuvable" message="Il a peut-être été supprimé." />
            </View>
        );
    }

    const isPast = isPastDate(event.date);
    const isCreator = event.createdBy === user?.id;
    const isParticipating = !!user && event.participantIds.includes(user.id);

    function confirmDelete(eventId: string, title: string) {
        Alert.alert(
            "Supprimer l'événement",
            `« ${title} » sera définitivement supprimé. Cette action est irréversible.`,
            [
                { text: "Annuler", style: "cancel" }, // Ferme simplement la boîte de dialogue
                {
                    text: "Supprimer",
                    style: "destructive", // Rouge sur iOS (sans effet visuel sur Android)
                    onPress: async () => {
                        // On quitte l'écran AVANT de supprimer : sinon, pendant un instant,
                        // le détail se re-rendrait sans son événement et afficherait « introuvable »
                        router.back();
                        try {
                            await deleteEvent(eventId);
                        } catch (error) {
                            // L'écran est fermé, mais Alert est global : l'erreur reste visible
                            Alert.alert(
                                "Erreur",
                                error instanceof Error ? error.message : "La suppression a échoué.",
                            );
                        }
                    },
                },
            ],
        );
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
            {/* Le titre du header devient celui de l'événement */}
            <Stack.Screen options={{ title: event.title }} />

            <Text style={styles.title}>{event.title}</Text>

            <View style={styles.infoBox}>
                <Text style={styles.date}>{formatEventDate(event.date)}</Text>
                {isPast ? <Text style={styles.past}>Cet événement est terminé.</Text> : null}
                <Text style={styles.meta}>{event.participantIds.length} participant(s)</Text>
            </View>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{event.description}</Text>

            <Text style={styles.meta}>
                {isCreator ? "Créé par vous" : "Créé par un autre membre"} · le{" "}
                {formatEventDate(event.createdAt)}
            </Text>

            <ParticipationToggle
                isParticipating={isParticipating}
                isPast={isPast}
                onToggle={() => toggleParticipation(event.id)}
            />

            {/* Actions réservées au créateur de l'événement */}
            {isCreator ? (
                <View style={styles.actions}>
                    <Button
                        title="Modifier"
                        onPress={() => router.push({ pathname: "/event/form", params: { id: event.id } })}
                    />
                    <Button
                        title="Supprimer"
                        variant="danger"
                        onPress={() => confirmDelete(event.id, event.title)}
                    />
                </View>
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
    },
    container: {
        padding: spacing.lg,
        gap: spacing.md,
    },
    title: {
        fontSize: fontSize.xl,
        fontWeight: "700",
        color: colors.text,
    },
    infoBox: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        gap: spacing.xs,
    },
    date: {
        fontSize: fontSize.md,
        fontWeight: "600",
        color: colors.primary,
    },
    past: {
        fontSize: fontSize.sm,
        color: colors.danger,
    },
    sectionTitle: {
        fontSize: fontSize.md,
        fontWeight: "700",
        color: colors.text,
    },
    description: {
        fontSize: fontSize.md,
        color: colors.text,
        lineHeight: 22, // Interligne : plus lisible pour un texte long
    },
    meta: {
        fontSize: fontSize.sm,
        color: colors.textMuted,
    },
    actions: {
        gap: spacing.sm,
        marginTop: spacing.md,
    },
});