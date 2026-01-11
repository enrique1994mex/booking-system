import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    // Branding
    colorPrimary: "#1677ff", // Azul AntD moderno (confianza)
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",

     // Fondos
    colorBgLayout: "#f5f7fa",
    colorBgContainer: "#ffffff",

    // Texto
    colorTextBase: "#1f2937", // Gris oscuro (no negro puro)
    colorTextSecondary: "#6b7280",

    // Border y formas
    controlHeight: 48,
    borderRadius: 8,

    // Estados
    colorBorder: "#e5e7eb",
    colorFillSecondary: "#f3f4f6",
  },
};