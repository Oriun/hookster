const { useState } = require('react')

window.hooksterHistory = {}
window.hooksterHistory.push = (location, state, title) => {
    window.history.pushState(state, title, location)
    document.title !== title && (document.title = title)
    window.hooksterHistory.listener.forEach(a => a?.(location))
}
window.hooksterHistory.listener = []
window.hooksterHistory.listen = listener => typeof listener === 'function' && (i => () => delete window.hooksterHistory.listener[i])(window.hooksterHistory.listener.push(listener))

const gethState = () => ({
    listen: window.hooksterHistory.listen,
    push: window.hooksterHistory.push,
    href: window.location.href,
    origin: window.location.origin,
    pathname: window.location.pathname,
    state: window.history.state
})
const usehooksterHistory = () => {
    const [hState, setState] = useState(gethState())
    window.hooksterHistory.listen(() => setState(gethState()))
    return hState
}

module.exports = usehooksterHistory