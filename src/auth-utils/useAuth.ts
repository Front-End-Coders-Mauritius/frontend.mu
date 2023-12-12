import { ref, computed } from "vue";
import type { User } from "../utils/types";

let isAuth = ref(false);
export default function useAuth() {

    function login() {
        // login logic
        isAuth.value = true;
    }

    function logout() {
        // logout logic
        isAuth.value = false;
    }

    const isLoggedIn = computed(() => {
        return isAuth.value;
    })

    function register() {
        // register logic
    }

    return {
        login,
        logout,
        isLoggedIn,
        user: {
            name: "John Doe",
            email: "",
        }
    }
}