// This file is from the wonderful example here: https://github.com/Charca/view-transitions-live

export function shouldNotIntercept(navigationEvent) {
    return (
        navigationEvent.canIntercept === false ||
        // If this is just a hashChange,
        // just let the browser handle scrolling to the content.
        navigationEvent.hashChange ||
        // If this is a download,
        // let the browser perform the download.
        navigationEvent.downloadRequest ||
        // If this is a form submission,
        // let that go to the server.
        navigationEvent.formData
    )
}

export function updateTheDOMSomehow(data) {
    document.getElementById('content').innerHTML = data
}

export function findCardByPath(path, parent = document) {
    return parent.querySelector(`[href="${path}"]`)
}

export function getPersistentElement(parent = document) {
    return parent.querySelector('[data-persist="true"]')
}

export function getPersistentElementContainer(parent = document) {
    return parent.querySelector('[data-persist-container="true"]')
}

let prevPageScroll = 0

navigation.addEventListener('navigate', (navigateEvent) => {
    if (shouldNotIntercept(navigateEvent)) return

    const toUrl = new URL(navigateEvent.destination.url)
    const toPath = toUrl.pathname
    const fromPath = location.pathname

    if (location.origin !== toUrl.origin) return

    return handleHomeTransition(navigateEvent, toPath, fromPath)
})



function handleHomeTransition(navigateEvent, toPath, fromPath) {
    navigateEvent.intercept({
        scroll: 'manual',
        async handler() {
            const response = await fetch(window.location.origin + toPath)
            const data = await response.text()

            if (!document.startViewTransition) {
                updateTheDOMSomehow(data)
                return
            }

            // Save a reference to any persistent elements (like video) if they exist
            const persistentEl = getPersistentElement()

            document.startViewTransition(() => {
                updateTheDOMSomehow(data)

                // Find the card that matches the playlist we're transitioning back from
                const card = findCardByPath(fromPath)

                // Add the 'with-transition' class to the transitioning card and
                // place the persistent element its container in the updated DOM
                if (card) {
                    card.classList.add('with-transition')
                    const persistentElContainer = getPersistentElementContainer(card)

                    if (persistentEl && persistentElContainer) {
                        persistentElContainer.replaceChildren(persistentEl)
                    }
                }

                // Restore page scroll
                if (prevPageScroll) {
                    document.documentElement.scrollTop = prevPageScroll
                }
            })
        },
    })
}