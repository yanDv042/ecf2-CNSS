const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  inscrireUser: async (userData) => {
    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: "Erreur de connexion au serveur" };
    }
  },

  loginUser: async (loginData) => {
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.login,
          password: loginData.motdepasse
        })
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: "Erreur de connexion au serveur" };
    }
  }
});
