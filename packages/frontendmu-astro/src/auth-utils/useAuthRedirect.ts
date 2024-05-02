import { computed, ref } from 'vue';
export default function useAuthRedirect() {
    const duration = ref(2500);
    const countdown = ref(duration.value);
    const willRedirect = ref(false);
    const countDownPercentage = computed(() => {
        return (((duration.value - countdown.value) / duration.value) * 100) + '%';
    });

    function setUrl() {
        let url = window.location.href;
        // Store in session storage
        sessionStorage.setItem('redirectUrl', url);
    }

    function tryRedirect() {
        const redirectUrl = sessionStorage.getItem('redirectUrl');
        sessionStorage.removeItem('redirectUrl');
        if (redirectUrl) {
            willRedirect.value = true;
            // start the countdown
            setTimeout(() => {
                window.location.href = redirectUrl;
            } , duration.value);     
            
            let intervalDelay = 10;
            // start the countdown such that the progress bar is updated every 100ms and and the countdown reaches 0 in duration ms
            let interval = setInterval(() => {
                countdown.value -= intervalDelay;
                if (countdown.value <= 0) {
                    clearInterval(interval);
                }
            }, intervalDelay);
            
            

            return true;
        }
    }

    return {
        setUrl,
        tryRedirect,
        countdown,
        duration,
        countDownPercentage,
        willRedirect    
    }
}