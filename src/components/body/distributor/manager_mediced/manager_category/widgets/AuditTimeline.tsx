import { FC } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { Paper, Typography } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { AuditLog } from "@/types/auditLog";

interface AuditTimelineProps {
  logs: AuditLog[];
}

const AuditTimeline: FC<AuditTimelineProps> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <Typography
        variant="body2"
        sx={{ textAlign: "center", color: "text.secondary", mt: 2 }}
      >
        Không có lịch sử hoạt động nào.
      </Typography>
    );
  }

  return (
    <Timeline position="alternate">
      {logs.map((log, index) => (
        <TimelineItem key={log.id}>
          <TimelineOppositeContent
            sx={{ flex: 0.2, color: "text.secondary", fontSize: 12 }}
          >
            {log.createdAt
              ? new Date(log.createdAt).toLocaleString("vi-VN")
              : "-"}
          </TimelineOppositeContent>

          <TimelineSeparator>
            <TimelineDot color="primary">
              <AccessTime fontSize="small" />
            </TimelineDot>
            {index !== logs.length - 1 && <TimelineConnector />}
          </TimelineSeparator>

          <TimelineContent>
            <Paper
              elevation={2}
              sx={{ p: 2, backgroundColor: "#e3f2fd", borderRadius: 2 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {log.action}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thực hiện bởi userId: {log.actorUserId}
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default AuditTimeline;
