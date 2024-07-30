import { defineStore } from "pinia";
import { useNotificationStore } from "/src/store/notification";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: null,
    email: "",
    verified: false,
    waiting_for_response: false,
  }),
  actions: {
    addToken(token) {
      this.token = token;
      this.email = "";
    },
    setEmail(email) {
      this.email = email;
    },
    setVerified(bool) {
      this.verified = bool;
    },
    sendVerificationCode(email = null) {
      this.waiting_for_response = true;
      const notificationStore = useNotificationStore();

      axios
        .put(
          "/auth/send-verification-code",
          email && {
            email: email,
          }
        )
        .then(() => {
          this.email = email;
          this.waiting_for_response = false;
          console.log(email);
          if (email) {
            this.router.push({ name: "Reset Password" });
          } else {
            this.router.push({ name: "Verify Email" });
          }
        })
        .catch((error) => {
          console.log(error);
          notificationStore.addNotification({
            type: "error",
            message: "Došlo je do pogreške, verifikacijski kod nije poslan.",
          });
          this.waiting_for_response = false;
        });
    },
  },
  persist: true,
});
