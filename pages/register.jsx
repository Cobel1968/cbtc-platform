import { useState } from "react";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cbtc-platform.onrender.com";
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) { setFormData({ ...formData, [e.target.name]: e.target.value }); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    if (formData.password !== formData.confirmPassword) {
      setMsg("❌ Les mots de passe ne correspondent pas");
      setLoading(false); return;
    }
    if (formData.password.length < 6) {
      setMsg("❌ Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false); return;
    }
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(`✅ Inscription réussie ! Bienvenue ${data.user?.name || formData.name}. Vous pouvez maintenant vous connecter.`);
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      } else {
        setMsg(`❌ Erreur: ${data.error || "Inscription échouée"}`);
      }
    } catch (err) {
      setMsg(`❌ Erreur réseau: ${err.message}`);
    } finally { setLoading(false); }
  }

  return (
    <main style={{ maxWidth: 420, margin: "48px auto", fontFamily: "Arial", padding: "0 20px" }}>
      <h1>🚀 CBTC - Inscription</h1>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
        <label>
          Nom complet *
          <input type="text" name="name" value={formData.name} onChange={handleChange} autoComplete="name"
            style={{ width: "100%", padding: 10, marginTop: 4 }} required />
        </label>
        <label>
          Email *
          <input type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="username"
            style={{ width: "100%", padding: 10, marginTop: 4 }} required />
        </label>
        <label>
          Mot de passe * (min. 6 caractères)
          <input type="password" name="password" value={formData.password} onChange={handleChange} autoComplete="new-password"
            style={{ width: "100%", padding: 10, marginTop: 4 }} minLength={6} required />
        </label>
        <label>
          Confirmer le mot de passe *
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} autoComplete="new-password"
            style={{ width: "100%", padding: 10, marginTop: 4 }} minLength={6} required />
        </label>
        <button type="submit" disabled={loading} style={{ padding: 12, backgroundColor: loading ? "#ccc" : "#007acc", color: "white", border: "none", borderRadius: 4, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>
      {msg && (
        <div style={{ marginTop: 20, padding: 12, borderRadius: 4, background: msg.startsWith("✅") ? "#E8FFE8" : "#FFEAEA", border: `1px solid ${msg.startsWith("✅") ? "#4CAF50" : "#F44336"}` }}>
          {msg}
        </div>
      )}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <p style={{ color: "#666" }}>
          Déjà inscrit ? <a href="/login" style={{ color: "#007acc" }}>Se connecter</a>
        </p>
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: "#999", textAlign: "center" }}>
        API: {API_URL}
      </div>
    </main>
  );
}
