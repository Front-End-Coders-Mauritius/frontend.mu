import { ref, computed } from "vue";
import { getCookieValue, DIRECTUS_URL, mapToValidUser } from './../utils/helpers';
import { createDirectus, rest, readMe, staticToken, authentication, updateItem, createItem, updateMe } from '@directus/sdk';

import type { SiteToast, User } from "../utils/types";
import type { DirectusAstroUser } from './../utils/types';
import type { AuthenticationData, DirectusClient, AuthenticationClient, RestClient, DirectusUser } from '@directus/sdk';

const DIRECTUS_PROJECT_URL = DIRECTUS_URL()

let isAuth = ref(false);
let user = ref<User | null>(null);
let rawUser = ref<DirectusAstroUser | null>(null);
let responseFromServer = ref<any>(null);
let isLoading = ref(false);

let toastMessage = ref<SiteToast>({
    title: undefined,
    message: undefined,
    type: undefined,
    visible: false
})

export function getClient() {
    return createDirectus(DIRECTUS_PROJECT_URL).with(authentication()).with(rest());
}

export function useToast() {
    function show(err: SiteToast) {
        toastMessage.value = err
    }

    function hide() {
        toastMessage.value.visible = false
    }

    const isVisible = computed(() => {
        return toastMessage.value.visible
    })

    return {
        toastMessage,
        isVisible,
        show,
        hide
    }
}

export default function useAuth(client: DirectusClient<any> & AuthenticationClient<any> & RestClient<any>) {

    async function logout() {
        logoutCookie()
        user.value = null;
        isAuth.value = false;
        responseFromServer.value = null;
    }

    function handleError(error) {
        responseFromServer.value = error;
    }

    function setCookie(authData: AuthenticationData) {
        document.cookie = `access_token=${authData.access_token}; expires=${new Date(authData.expires_at ?? '').toUTCString()}; path=/`;
    }

    function setCurrentUser(data: User) {
        user.value = data;
    }

    function logoutCookie() {
        // set cookie logic
        document.cookie = `access_token=; expires=${new Date().toUTCString()}; path=/`;
    }

    async function loginWithUsernameAndPassword(email: string, password: string) {
        try {

            isLoading.value = true;
            const result = await client.login(email, password);
            isLoading.value = false;
            responseFromServer.value = result;

            if (result.access_token && result.expires_at) {
                setCookie(result)
            }

            getCurrentUser()

            setAuth(true)

            useToast().show({
                title: "Success!",
                message: "User is logged in",
                type: "SUCCESS",
                visible: true
            })

            return result

        } catch (error) {
            console.log(error)
        }
    }

    async function loginWithSSO() {
        try {
            const res = await fetch(
                "https://directus.frontend.mu/auth/refresh",
                {
                    method: "POST",
                    credentials: "include", // this is required in order to send the refresh token cookie
                },
            );

            const response: { data: AuthenticationData } = await res.json();

            setCookie(response.data);
            getCurrentUser()
            setAuth(true)

            return response.data;
        } catch (error) {
            console.log(error)
        }
    }

    const isLoggedIn = computed(() => {
        return !!isAuth.value;
    })

    function setAuth(value: boolean) {
        if (value === false) {
            isLoading.value = false;
        }

        isAuth.value = value;
    }

    async function checkIfLoggedIn() {
        try {
            await getCurrentUser()
            return true
        } catch (error) {
            setAuth(false)
            handleError(error)
        }
    }

    async function getCurrentUser() {

        const ACCOUNT_SETTINGS_FIELDS = [
            "id",
            "first_name",
            "last_name",
            "email",
            "meal",
            "Events.Events_id.*",
        ]

        try {

            const token = getCookieValue('access_token')

            if (!token) {
                throw new Error('User is not logged in')
            }

            client = await client.with(staticToken(token))

            const result = await client.request(readMe({
                fields: ACCOUNT_SETTINGS_FIELDS
            }));

            setAuth(true)
            rawUser.value = result;

            setCurrentUser(mapToValidUser(result));

        } catch (error) {
            handleError(error)
            throw new Error(error)
        }

    }

    const currentEventsRSVP = computed(() => {
        return rawUser.value?.Events?.map((event) => {
            if (typeof event.Events_id === 'string') {
                return { "Events_id": event.Events_id }
            }
            return { "Events_id": event.Events_id.id.toString() }
        }) || []
    })

    function oAuthLogin() {
        const currentPage = new URL(window.location.origin);
        return `${DIRECTUS_URL()}/auth/login/google?redirect=${currentPage}redirect`
    }

    async function updateUserProfile(data: DirectusAstroUser) {
        try {
            isLoading.value = true;
            const token = getCookieValue('access_token')

            if (!token) {
                isLoading.value = false;
                throw new Error('User is not logged in')
            }

            client = await client.with(staticToken(token))

            const result = await client.request(updateMe(data));
            await getCurrentUser();
            isLoading.value = false;

            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    return {
        loginWithUsernameAndPassword,
        logout,
        isLoggedIn,
        getCurrentUser,
        checkIfLoggedIn,
        rawUser,
        user,
        responseFromServer,
        client,
        loginWithSSO,
        oAuthLogin,
        updateUserProfile,
        currentEventsRSVP,
        isLoading
    }
}