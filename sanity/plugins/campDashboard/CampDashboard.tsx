import { useCallback, useEffect, useState } from "react";
import { useClient } from "sanity";
import { Box, Button, Card, Flex, Grid, Heading, Spinner, Stack, Text } from "@sanity/ui";
import { SyncIcon } from "@sanity/icons";

interface RegistrationStats {
  total: number;
  pendingPayment: number;
  awaitingVerification: number;
  confirmed: number;
  checkedIn: number;
  completed: number;
  cancelled: number;
  waitlist: number;
  awaitingPaymentReview: number;
  capacity: number | null;
  recent: Array<{
    _id: string;
    registrationId: string;
    parentFullName: string;
    childrenFullNames: string;
    status: string;
    paymentStatus: string;
    submissionDate: string;
  }>;
}

const QUERY = `{
  "total":                count(*[_type == "futureMakersRegistration"]),
  "pendingPayment":       count(*[_type == "futureMakersRegistration" && status == "pending-payment"]),
  "awaitingVerification": count(*[_type == "futureMakersRegistration" && status == "awaiting-verification"]),
  "confirmed":            count(*[_type == "futureMakersRegistration" && status == "confirmed"]),
  "checkedIn":            count(*[_type == "futureMakersRegistration" && status == "checked-in"]),
  "completed":            count(*[_type == "futureMakersRegistration" && status == "completed"]),
  "cancelled":            count(*[_type == "futureMakersRegistration" && status == "cancelled"]),
  "waitlist":             count(*[_type == "futureMakersRegistration" && status == "waitlist"]),
  "awaitingPaymentReview": count(*[_type == "futureMakersRegistration" && paymentStatus == "awaiting-review"]),
  "capacity": *[_type == "campSettings"][0].capacity,
  "recent": *[_type == "futureMakersRegistration"] | order(submissionDate desc)[0..9] {
    _id, registrationId, parentFullName, childrenFullNames, status, paymentStatus, submissionDate
  }
}`;

const STATUS_LABEL: Record<string, string> = {
  "pending-payment":       "Pending Payment",
  "awaiting-verification": "Awaiting Verification",
  "confirmed":             "Confirmed",
  "checked-in":            "Checked In",
  "completed":             "Completed",
  "cancelled":             "Cancelled",
  "waitlist":              "Waitlist",
};

const PAYMENT_LABEL: Record<string, string> = {
  "awaiting-review": "Awaiting Review",
  "deposit-paid":    "Deposit Paid",
  "fully-paid":      "Fully Paid",
  "payment-issue":   "Payment Issue",
  "refunded":        "Refunded",
};

function StatCard({
  label,
  value,
  tone,
  highlight,
}: {
  label: string;
  value: number;
  tone?: "default" | "positive" | "caution" | "critical";
  highlight?: boolean;
}) {
  return (
    <Card padding={3} radius={2} tone={tone ?? "default"} border shadow={highlight ? 1 : 0}>
      <Stack space={2}>
        <Text size={1} muted>{label}</Text>
        <Text size={4} weight="bold">{value}</Text>
      </Stack>
    </Card>
  );
}

function CapacityBar({ filled, capacity }: { filled: number; capacity: number }) {
  const pct = Math.min(Math.round((filled / capacity) * 100), 100);
  const remaining = Math.max(capacity - filled, 0);
  const tone = pct >= 100 ? "critical" : pct >= 90 ? "critical" : pct >= 80 ? "caution" : "positive";
  const barColor = pct >= 90 ? "#ef4444" : pct >= 80 ? "#f59e0b" : "#22c55e";

  return (
    <Card padding={4} radius={2} border>
      <Stack space={3}>
        <Flex justify="space-between" align="center">
          <Text size={1} weight="semibold">Capacity</Text>
          <Text size={1} muted>{filled} confirmed of {capacity} places</Text>
        </Flex>
        <Box
          style={{
            height: 12,
            background: "#e5e7eb",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <Box
            style={{
              height: "100%",
              width: `${pct}%`,
              background: barColor,
              borderRadius: 6,
              transition: "width 0.4s ease",
            }}
          />
        </Box>
        <Flex justify="space-between" align="center">
          <Text size={1} weight="semibold" style={{ color: barColor }}>{pct}% filled</Text>
          <Card padding={1} radius={1} tone={tone}>
            <Text size={0}>{remaining} place{remaining !== 1 ? "s" : ""} remaining</Text>
          </Card>
        </Flex>
      </Stack>
    </Card>
  );
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export function CampDashboard() {
  const client = useClient({ apiVersion: "2025-01-01" });
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(() => {
    setLoading(true);
    client
      .fetch<RegistrationStats>(QUERY)
      .then((data) => {
        setStats(data);
        setLastUpdated(new Date());
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [client]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const capacity = stats?.capacity ?? 50;
  const confirmed = (stats?.confirmed ?? 0) + (stats?.checkedIn ?? 0) + (stats?.completed ?? 0);

  return (
    <Box padding={4} style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Stack space={5}>
        {/* Header */}
        <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
          <Stack space={1}>
            <Heading size={3}>Camp Dashboard</Heading>
            <Text size={1} muted>Future Makers Summer Experience 2026</Text>
          </Stack>
          <Flex align="center" gap={2}>
            {lastUpdated && (
              <Text size={0} muted>
                Updated {lastUpdated.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </Text>
            )}
            <Button
              icon={SyncIcon}
              text="Refresh"
              tone="default"
              mode="ghost"
              fontSize={1}
              padding={2}
              onClick={fetchStats}
              disabled={loading}
            />
          </Flex>
        </Flex>

        {loading && !stats && (
          <Flex justify="center" padding={6}>
            <Spinner />
          </Flex>
        )}

        {stats && (
          <Stack space={5}>
            {/* Payment alert */}
            {stats.awaitingPaymentReview > 0 && (
              <Card padding={3} radius={2} tone="caution" border>
                <Flex align="center" gap={2}>
                  <Text size={1} weight="semibold">
                    {stats.awaitingPaymentReview} registration{stats.awaitingPaymentReview !== 1 ? "s" : ""} waiting for payment verification
                  </Text>
                </Flex>
              </Card>
            )}

            {/* Capacity bar */}
            <CapacityBar filled={confirmed} capacity={capacity} />

            {/* Registration status cards */}
            <Stack space={2}>
              <Text size={1} weight="semibold" muted style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Registrations by Status
              </Text>
              <Grid columns={[2, 2, 4]} gap={2}>
                <StatCard label="Total" value={stats.total} />
                <StatCard label="Pending Payment" value={stats.pendingPayment} tone={stats.pendingPayment > 0 ? "caution" : "default"} />
                <StatCard label="Awaiting Verification" value={stats.awaitingVerification} tone={stats.awaitingVerification > 0 ? "caution" : "default"} />
                <StatCard label="Confirmed" value={stats.confirmed} tone={stats.confirmed > 0 ? "positive" : "default"} />
                <StatCard label="Checked In" value={stats.checkedIn} tone={stats.checkedIn > 0 ? "positive" : "default"} />
                <StatCard label="Completed" value={stats.completed} tone={stats.completed > 0 ? "positive" : "default"} />
                <StatCard label="Cancelled" value={stats.cancelled} tone={stats.cancelled > 0 ? "critical" : "default"} />
                <StatCard label="Waitlist" value={stats.waitlist} />
              </Grid>
            </Stack>

            {/* Recent registrations */}
            {stats.recent.length > 0 && (
              <Stack space={2}>
                <Text size={1} weight="semibold" muted style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Recent Registrations
                </Text>
                <Card radius={2} border overflow="hidden">
                  {stats.recent.map((r, i) => (
                    <Box
                      key={r._id}
                      padding={3}
                      style={{ borderTop: i === 0 ? "none" : "1px solid var(--card-border-color)" }}
                    >
                      <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                        <Stack space={1}>
                          <Flex align="center" gap={2}>
                            <Text size={1} weight="semibold">{r.registrationId ?? "—"}</Text>
                            <Text size={1} muted>·</Text>
                            <Text size={1}>{r.parentFullName ?? "—"}</Text>
                          </Flex>
                          <Text size={0} muted>{r.childrenFullNames ?? "—"}</Text>
                        </Stack>
                        <Flex align="center" gap={2}>
                          <Text size={0} muted>{r.submissionDate ? fmtDate(r.submissionDate) : "—"}</Text>
                          <Card
                            padding={1}
                            radius={1}
                            tone={
                              r.status === "confirmed" || r.status === "checked-in" || r.status === "completed"
                                ? "positive"
                                : r.status === "cancelled"
                                ? "critical"
                                : "caution"
                            }
                          >
                            <Text size={0}>{STATUS_LABEL[r.status] ?? r.status}</Text>
                          </Card>
                          <Card
                            padding={1}
                            radius={1}
                            tone={
                              r.paymentStatus === "fully-paid" || r.paymentStatus === "deposit-paid"
                                ? "positive"
                                : r.paymentStatus === "payment-issue"
                                ? "critical"
                                : "caution"
                            }
                          >
                            <Text size={0}>{PAYMENT_LABEL[r.paymentStatus] ?? r.paymentStatus}</Text>
                          </Card>
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                </Card>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
