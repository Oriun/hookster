const { useState } = require('react')


/**
 * Deeply update an object, touching only the specified properties. Imitates the setState function of React.
 * 
 * @param {any} obj the object to update 
 * @param {Object} diffs the path to the properties to modify
 * @param {boolean} [deleteUndefined=false] default to false, if set to true an existing property will be removed if its value have to be set to undefined
 * 
 * @returns a copy of the updated object
 * 
 * @author Emmanuel Nuiro
 * 
 **/
const ObjectDiff = (obj, diffs, deleteUndefined = false) => {
    Object.entries(diffs).forEach(([key, value]) => {
        if (value === undefined && deleteUndefined) return delete obj[key]
        if (!obj[key] || !(obj[key] instanceof Object) || !(value instanceof Object)) return obj[key] = value
        ObjectDiff(obj[key], value)
    })
    return { ...obj }
}

/**
 * Merge states like class components' setState
 * @param {*} initState 
 * @returns {[any, React.Dispatch<any>]}
 * @author Emmanuel Nuiro
 */
const useDiffState = initState => {
    console.log('yo')
    const [state, setState] = useState(initState)
    return [
        state,
        typeof state !== 'object' ? setState : (obj => typeof obj === 'object' ? setState(ObjectDiff(state, obj)) : setState(obj)),
        setState
    ]
}

module.exports = useDiffState