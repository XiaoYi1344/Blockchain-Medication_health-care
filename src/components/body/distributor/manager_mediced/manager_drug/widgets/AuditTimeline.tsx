"use client";

import * as React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import {
  Typography,
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";
import {
  CheckCircle,
  Edit,
  Delete,
  Block,
  AddCircle,
  History,
} from "@mui/icons-material";
import { useAuditLogsByProduct } from "@/hooks/database/useAudit";

interface AuditTimelineProps {
  entityType: string;
  entityId: string | number;
}


const actionIcons: Record<string, React.ReactNode> = {
  CREATED: <AddCircle color="success" />,
  UPDATED: <Edit color="primary" />,
  APPROVED: <CheckCircle color="success" />,
  DELETED: <Delete color="error" />,
  REVOKED: <Block color="warning" />,
};

export default function AuditTimeline({ entityId }: AuditTimelineProps) {
  const { data: logs, isLoading } = useAuditLogsByProduct(entityId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        ⚠️ Chưa có lịch sử cho thuốc này
      </Typography>
    );
  }

  return (
    <Timeline position="alternate">
      {logs.map((log, idx) => (
        <TimelineItem key={log.id}>
          <TimelineOppositeContent
            sx={{ m: "auto 0" }}
            align="right"
            variant="body2"
            color="text.secondary"
          >
            {log.createdAt
              ? new Date(log.createdAt).toLocaleString()
              : "Không rõ thời gian"}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color="primary">
              {actionIcons[log.action] ?? <History />}
            </TimelineDot>
            {idx < logs.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent sx={{ py: "12px", px: 2 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="subtitle1" component="span">
                {log.action}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Người thực hiện: {log.actorUserId ?? "Hệ thống"}
              </Typography>
              {log.oldValue && log.newValue && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {`Thay đổi từ "${log.oldValue}" → "${log.newValue}"`}
                </Typography>
              )}
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
