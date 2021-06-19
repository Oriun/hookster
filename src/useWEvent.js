const { useState } = require("react")

const createWEvent = (key, emit = (...a) => a) => {
    window[key] = {}
    window[key].emit = (...a) => {
        const update = emit(...a)
        window[key].listener.forEach(b => b(...[update].flat(), ...a))
    }
    window[key].listener = []
    window[key].listen = listener => typeof listener === 'function' && (i => () => delete window[key].listener[i])(window[key].listener.emit(listener))
}

const useWEvent = (name, emit) => {
    const [key] = useState('WE' + name)
    if (!window[key]) createWEvent(key, emit)
    return [window[key].listen, window[key].emit]
}

module.exports = useWEvent