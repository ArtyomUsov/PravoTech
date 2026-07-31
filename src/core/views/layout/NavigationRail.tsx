import React from "react";
import { observer } from "mobx-react-lite";
import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import {
  Home,
  Folder,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { useMobx } from "../../../app/providers";
import { theme } from "../../../app/theme";

type Page = "today" | "workspace" | "settings";

const navItems = [
  {
    id: "today" as Page,
    label: "Сегодня",
    icon: Home,
    onClick: (onNavigate: (page: Page, workspaceId?: string) => void) =>
      onNavigate("today"),
    active: (currentPage: Page, currentWorkspaceId: string | null) =>
      currentPage === "today",
  },
  {
    id: "my-cases" as Page,
    label: "Мои дела",
    icon: Folder,
    onClick: (onNavigate: (page: Page, workspaceId?: string) => void) =>
      onNavigate("workspace", "my-cases"),
    active: (currentPage: Page, currentWorkspaceId: string | null) =>
      currentPage === "workspace" && currentWorkspaceId === "my-cases",
  },
  {
    id: "settings" as Page,
    label: "Настройки",
    icon: Settings,
    onClick: (onNavigate: (page: Page, workspaceId?: string) => void) =>
      onNavigate("settings"),
    active: (currentPage: Page, currentWorkspaceId: string | null) =>
      currentPage === "settings",
  },
] as const;

const collapsedWidth = 72;
const expandedWidth = 200;

export const NavigationRail = observer(
  ({
    currentPage,
    currentWorkspaceId,
    onNavigate,
  }: {
    currentPage: Page;
    currentWorkspaceId: string | null;
    onNavigate: (page: Page, workspaceId?: string) => void;
  }) => {
    const [expanded, setExpanded] = React.useState(false);

    const userName = "Лев Толстой";
    const getInitials = (name: string) => name.charAt(0).toUpperCase();
    const width = expanded ? expandedWidth : collapsedWidth;

    return (
      <Box
        sx={{
          width,
          minWidth: width,
          bgcolor: "transparent",
          color: "text.primary",
          display: "flex",
          flexDirection: "column",
          alignItems: expanded ? "stretch" : "center",
          py: 2,
          gap: 0.5,
          transition: "width 0.25s ease",
          overflow: "hidden",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: expanded ? "space-between" : "center",
            mb: 2,
            px: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              transition: "opacity 0.2s",
              overflow: "hidden",
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                bgcolor: "#8C26EA",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {getInitials(userName)}
            </Avatar>

            {expanded && (
              <Typography
                noWrap
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#8C26EA",
                  maxWidth: "calc(100% - 40px)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {userName}
              </Typography>
            )}
          </Box>

          <Tooltip title={expanded ? "Свернуть" : "Развернуть"}>
            <IconButton
              onClick={() => setExpanded((v) => !v)}
              sx={{
                width: 12,
                height: 32,
                borderRadius: 1,
                padding: 1,
                color: "text.secondary",
              }}
            >
              {expanded ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </Tooltip>
        </Box>

        {navItems.map((item) => {
          const isActive = item.active(currentPage, currentWorkspaceId);
          const Icon = item.icon;

          return (
            <Tooltip
              key={item.id}
              title={item.label}
              placement="right"
              disableHoverListener={expanded}
            >
              <Box
                onClick={() => item.onClick(onNavigate)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2,
                  py: 1.25,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  bgcolor: isActive ? "action.selected" : "transparent",
                  "&:hover": {
                    bgcolor: isActive ? "action.selected" : "action.hover",
                  },
                  opacity: expanded ? 1 : 1,
                  width: "100%",
                }}
              >
                <Icon
                  sx={{
                    fontSize: 22,
                    color: isActive ? "#8C26EA" : "text.secondary",
                  }}
                />
                {expanded && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isActive ? 600 : 400,
                      whiteSpace: "nowrap",
                      color: isActive ? "#8C26EA" : "text.secondary",
                    }}
                  >
                    {item.label}
                  </Typography>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    );
  }
);
