const { useState } = require("react")
const useWEvent = require('./useWEvent')


const upgradeStorage = (key, storage, emit) => {
    storage.oldSet = storage.setItem
    storage.setItem = (name, value) => {
        if (name !== key) return storage.oldSet(name, value)
        emit(value)
        return storage.oldSet(name, JSON.stringify(value))
    }
    storage.useStoraged = true
}
/**
 * 
 * @param {string} name 
 * @param {"session"|"local"} backUp 
 * @param {any} defaultValue 
 */
const useStorage = (name, backUp = 'session', defaultValue = undefined) => {
    const [key] = useState(name)
    const [emit, listen] = useWEvent('useStorageEvent:' + key)
    const storage = window[backUp + 'Storage']
    if (!storage) throw new Error('invalid backup')
    if (!storage[key]) storage[key] = JSON.stringify(defaultValue)
    if (!storage.useStoraged) upgradeStorage(key, storage, emit)
    const [value, update] = useState(storage[key])
    listen(a => update(a))
    return [value, val => emit(key, val)]
}

module.exports = useStorage