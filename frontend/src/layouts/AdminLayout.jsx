export default function AdminLayout({ children }) {
  return (
    <div
      style={{
        background: "black",
        color: "white",
        minHeight: "100vh",
        padding: "40px"
      }}
    >
      <h1>ADMIN LAYOUT WORKING</h1>

      {children}
    </div>
  );
}