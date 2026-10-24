<template>
  <div class="account">
    <template v-if="account.status === 'guest'">
      <p>Log in to save your runs and get on the leaderboard.</p>
      <a class="primary" :href="LOGIN_URL">Log in with Google</a>
      <RouterLink class="muted small" to="/privacy">Privacy policy</RouterLink>
    </template>

    <template v-else-if="account.status === 'error'">
      <p class="muted">Accounts are unavailable right now. You can still play.</p>
    </template>

    <form v-else-if="account.status === 'needsName' || editing" @submit.prevent="submitName">
      <label for="display-name">
        {{ editing ? "Change your display name" : "Choose a display name to save your runs" }}
      </label>
      <div class="row">
        <input
          id="display-name"
          v-model="nameInput"
          maxlength="16"
          autocomplete="off"
          spellcheck="false"
          placeholder="3-16 letters, numbers, _ or -"
        />
        <button class="primary" type="submit" :disabled="saving">Save</button>
      </div>
      <p v-if="nameError" class="error">{{ nameError }}</p>
      <div v-if="editing" class="row links">
        <button type="button" @click="editing = false">Cancel</button>
        <!-- Hidden mid-run: the run belongs to the account, so it would end with it. -->
        <button v-if="!game.inRun" type="button" class="danger" @click="confirmDelete">Delete account</button>
      </div>
    </form>

    <div v-else-if="account.status === 'ready'" class="row signed-in">
      <p>Playing as <strong>{{ account.displayName }}</strong></p>
      <div class="row links">
        <button type="button" @click="startEditing">Change name</button>
        <!-- Hidden mid-run: a logged-out browser can't act on the player's run. -->
        <button v-if="!game.inRun" type="button" @click="account.logout()">Log out</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { useAccountStore, LOGIN_URL } from "@/shared/stores/useAccountStore.js";
import { useGameStore } from "../stores/useGameStore.js";

const account = useAccountStore();
const game = useGameStore();
const editing = ref(false);
const nameInput = ref("");
const nameError = ref(null);
const saving = ref(false);

onMounted(() => {
  if (account.status === "loading") account.load();
});

function startEditing() {
  nameInput.value = account.displayName ?? "";
  nameError.value = null;
  editing.value = true;
}

async function submitName() {
  saving.value = true;
  nameError.value = await account.saveDisplayName(nameInput.value.trim());
  saving.value = false;
  if (!nameError.value) editing.value = false;
}

async function confirmDelete() {
  const sure = window.confirm(
    "Delete your account? Your display name and all your saved runs will be removed. This can't be undone.",
  );
  if (!sure) return;
  await account.deleteAccount();
  editing.value = false;
}
</script>

<style scoped>
.account {
  max-width: 20rem;
  margin: 0 auto var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  font-size: 0.875rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.row {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.signed-in {
  justify-content: space-between;
  flex-wrap: wrap;
}

.links {
  gap: var(--space-md);
}

input {
  flex: 1;
  min-width: 0;
  padding: var(--space-sm);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  color: var(--color-text);
  font: inherit;
}

.primary {
  display: inline-block;
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-button);
  border: none;
  border-radius: 0.5rem;
  color: var(--color-text);
  font: inherit;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

.primary:hover {
  background-color: var(--color-button-hover);
}

.primary:disabled {
  opacity: 0.6;
  cursor: wait;
}

.links button {
  padding: 0;
  background: none;
  border: none;
  color: var(--color-text-muted);
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}

.links button:hover {
  color: var(--color-text);
}

.links .danger {
  color: var(--color-danger);
  margin-left: auto;
}

.muted {
  color: var(--color-text-muted);
}

.small {
  font-size: 0.75rem;
  text-align: center;
}

.error {
  color: #e05c5c;
}
</style>
