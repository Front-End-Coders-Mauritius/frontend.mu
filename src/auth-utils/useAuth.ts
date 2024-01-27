import { ref, computed } from "vue";
import { getCookieValue, DIRECTUS_URL, mapToValidUser, base64Url } from './../utils/helpers';
import { createDirectus, rest, readMe, staticToken, authentication, updateItem, createItem, updateMe, readItems } from '@directus/sdk';

import type { RSVPMetaData, SiteToast, User } from "../utils/types";
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
    visible: false,
})

export function getClient() {
    return createDirectus(DIRECTUS_PROJECT_URL).with(authentication()).with(rest());
}

export function useToast() {
    function show(message: SiteToast) {
        toastMessage.value = message
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
            await getCurrentUser()
            setAuth(true)
            console.log(rawUser.value)
            if (!rawUser.value?.profile_picture) {
                let picture = await cloudFunctionUpdateProfilePicture(rawUser.value?.id)
                console.log(picture)
            }

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
            "phone",
            "transport",
            "meal",
            "occupation",
            "github_username",
            "Events.Events_id.*",
            "profile_picture",
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

    const avatarUrl = computed(() => {
        if (rawUser.value?.profile_picture) {
            return base64Url(rawUser.value.profile_picture)
        } else if (rawUser.value?.github_username) {
            return `https://github.com/${rawUser.value?.github_username}.png`
        }
        return false;
    })

    function oAuthLogin() {
        const currentPage = new URL(window.location.origin);
        return `${DIRECTUS_URL()}/auth/login/google?redirect=${currentPage}redirect`
    }

    // !TODO refactor to use object instead
    async function updateUserProfile(data: DirectusAstroUser, currentEventId: string = '', metadata: RSVPMetaData, isCancelling: boolean = false) {
        try {
            isLoading.value = true;
            const token = getCookieValue('access_token')

            if (!token) {
                isLoading.value = false;
                alert('yarm')
                useToast().show({
                    title: "Session expired",
                    message: "Please login again.",
                    type: "INFO",
                    visible: true,
                })
                throw new Error('User is not logged in')
            }

            client = await client.with(staticToken(token))

            const result = await client.request(updateMe(data));

            if (!isCancelling) {
                updateRsvpMetadata(currentEventId, metadata)
            }

            await getCurrentUser();
            isLoading.value = false;

            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    async function cancelRsvp(data: DirectusAstroUser, currentEventId: string = '') {
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

    async function updateRsvpMetadata(currentEventId: string, metadata: RSVPMetaData) {
        try {
            isLoading.value = true;
            const token = getCookieValue('access_token')

            if (!token) {
                isLoading.value = false;
                throw new Error('User is not logged in')
            }

            client = await client.with(staticToken(token))

            console.log(currentEventId)

            const query_object = {
                filter: {
                    Events_id: {
                        _eq: currentEventId
                    },
                    directus_users_id: {
                        _eq: user.value?.id
                    }
                }
            }

            const primaryKeyQuery = await client.request(readItems('Events_directus_users', query_object));

            const updateMetaResult = await client.request(updateItem('Events_directus_users', primaryKeyQuery[0].id, {
                meta: metadata.meta,
                meal: metadata.meal,
                transport: metadata.transport,
                occupation: metadata.occupation,
                is_public: metadata.is_public,
            }));

            await getCurrentUser();

            console.log(updateMetaResult);
            isLoading.value = false;
        } catch (error) {
            console.log(error)
        }
    }

    async function cloudFunctionUpdateProfilePicture(userId) {

        const ORIGIN = window.location.origin;
        const FUNCTION_AUTH_PICTURE_URL = `${ORIGIN}/api/auth-picture`

        const result = await fetch(FUNCTION_AUTH_PICTURE_URL, {
            method: 'POST',
            headers: {
                'user-id': userId,
                'access-token': getCookieValue('access_token')
            },
        });

        console.log(result);

        useToast().show({
            title: "Success!",
            message: "Profile picture synced successfully",
            type: "SUCCESS",
            visible: true
        })


    }

    return {
        cloudFunctionUpdateProfilePicture,
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
        cancelRsvp,
        currentEventsRSVP,
        isLoading,
        avatarUrl
    }
}