/** @format */

export default function LoadingSpinner() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>Yuklanmoqda...</p>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f9f9f9",
    gap: "12px",
  },
  spinner: {
    width: "60px",
    height: "60px",
    border: "6px solid #ddd",
    borderTop: "6px solid #4CAF50",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  text: {
    fontSize: "18px",
    color: "#333",
    fontWeight: "500",
  },
};

// 🔑 CSS animation qo'shish
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(
  `@keyframes spin { 
        0% { transform: rotate(0deg); } 
        100% { transform: rotate(360deg); } 
    }`,
  styleSheet.cssRules.length
);
