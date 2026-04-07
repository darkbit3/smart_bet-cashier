import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-right"
      richColors
      closeButton
      className="toaster group"
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid #e2e8f0",
          borderRadius: "1rem",
          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -2px rgba(0,0,0,0.03)",
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          fontSize: "14px",
          fontWeight: "500",
          color: "#0f172a",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
