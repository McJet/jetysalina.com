import { defineStore } from "pinia";

// Login leaves the site (to Google and back), so it's a full page
// navigation to the API, not a fetch.
export const LOGIN_URL = "/api/auth/google";

/**
 * @typedef {'loading' | 'guest' | 'needsName' | 'ready' | 'error'} AccountStatus
 */

export const useAccountStore = defineStore("account", {
  state: () => {
    return {
      /** @type {AccountStatus} */
      status: "loading",
      email: null,
      displayName: null,
    };
  },
  getters: {
    isLoggedIn: (state) =>
      state.status === "needsName" || state.status === "ready",
  },
  actions: {
    async load() {
      try {
        const res = await fetch("/api/me");
        if (res.status === 401) {
          this.setGuest();
          return;
        }
        if (!res.ok) throw new Error(`/api/me returned ${res.status}`);
        this.setAccount(await res.json());
      } catch (error) {
        // API down or unreachable: the game still works, logged out.
        console.error(error);
        this.status = "error";
      }
    },

    // Returns an error message to show, or null on success.
    async saveDisplayName(displayName) {
      const res = await fetch("/api/me/display-name", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName }),
      });
      if (res.status === 401) {
        this.setGuest();
        return "You've been logged out. Log in again to choose a name.";
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return data.error ?? "Something went wrong. Try again.";
      this.displayName = data.displayName;
      this.status = "ready";
      return null;
    },

    async logout() {
      await fetch("/api/auth/logout", { method: "POST" });
      this.setGuest();
    },

    async deleteAccount() {
      const res = await fetch("/api/me", { method: "DELETE" });
      if (!res.ok && res.status !== 401) {
        throw new Error(`DELETE /api/me returned ${res.status}`);
      }
      this.setGuest();
    },

    setAccount({ email, displayName }) {
      this.email = email;
      this.displayName = displayName;
      this.status = displayName ? "ready" : "needsName";
    },

    setGuest() {
      this.email = null;
      this.displayName = null;
      this.status = "guest";
    },
  },
});
