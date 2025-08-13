import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cbtc-platform.onrender.com";

export default function TestLogin() {
  const [email, setEmail] = useState("demo@cbtc.com");
  const [password, setPassword] = useState("demo123");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(`✅ Connexion réussie. Token: ${String(data.token || "").slice(0,50)}...`);
        if (data.token) localStorage.setItem("token", data.token);
      } else {
        setMsg(`❌ Erreur: ${data.error || "Connexion échouée"}`);
      }
    } catch (err) {
      setMsg(`❌ Erreur réseau: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function testBackend() {
    setMsg("⏳ Test de santé du backend...");
    try {
      const res = await fetch(`${API_URL}/health`);
      const data = await res.json();
      setMsg(`🔍 Santé backend: ${JSON.stringify(data)}`);
    } catch (err) {
      setMsg(`❌ Backend inaccessible: ${err.message}`);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "48px auto", fontFamily: "Arial" }}>
      <h1>🚀 CBTC - Test Login</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            style={{ width: "100%", padding: 8 }}
            required
          />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={{ width: "100%", padding: 8 }}
            required
          />
        </label>
        <button type="submit" disabled={loading} style={{ padding: 10 }}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <button onClick={testBackend} style={{ marginTop: 10 }}>
        🔍 Tester la santé backend
      </button>
      {msg && (
        <div style={{ marginTop: 16, padding: 10, background: msg.startsWith("✅") ? "#E8FFE8" : "#FFEAEA" }}>
          {msg}
        </div>
      )}
      <div style={{ marginTop: 16, fontSize: 12, color: "#666" }}>
        API: {API_URL}
      </div>
    </main>
  );
}
