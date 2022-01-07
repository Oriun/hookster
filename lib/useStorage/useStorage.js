import { useState } from "react"
import useWEvent from './useWEvent'

/** NOT RECOMMENDED NOR SUITABLE FOR PROJECT THAT NEED PERFORMANCES */

const upgradeStorage = (key, storage, emit) => {
    storage.__proto__.oldSet = storage.setItem
    storage.__proto__.setItem = (name, value) => {
        if (name !== key) return storage.oldSet(name, value)
        emit(value)
        storage.oldSet(name, JSON.stringify(value))
    }
    storage.useStoraged = true
}

/**
 * 
 * @param {string} name 
 * @param {"session"|"local"} backUp 
 * @param {any} defaultValue 
 */
const useStorage = (name, backUp = 'session', defaultValue = null) => {
    const [key] = useState(name)
    const [emit, listen] = useWEvent('useStorageEvent:' + key)
    const storage = window[backUp + 'Storage']
    if (!storage) throw new Error('invalid backup')
    if (!storage[key]) storage[key] = JSON.stringify(defaultValue)
    if (!storage.useStoraged) upgradeStorage(key, storage, emit)
    const [value, update] = useState(storage[key])
    listen(a => update(a))
    return [value, emit]
}

export default useStorage