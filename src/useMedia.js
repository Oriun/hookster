const { useState, useEffect } = require('react')

const translateToPixel = string => {
    // NOW => only handle pixels value
    // NEXT => handle viewport units
    return parseFloat(string)
}

const isTrue = (mediaquery, element) => {
    if (!mediaquery.includes(':'))
        throw new Error('Unsupported query')
    const [type, value] = mediaquery.split(/ *: */)
    const pixels = translateToPixel(value)
    switch (type) {
        case 'max-width': return element.width <= pixels
        case 'min-width': return element.width >= pixels
        case 'max-height': return element.height <= pixels
        case 'min-height': return element.height >= pixels
        default: return false
    }
}

/**
 * 
 * @param {Object<string, string>} queries 
 * @param {HTMLElement | Node} element 
 * @returns {[Object<string, boolean>, ()=>void]}
 */
const useMedia = (queries, element) => {
    const [execQueries, setExecQueries] = useState(queries)
    const [el, setEl] = useState(element || document.querySelector('#root'))
    const [funcs, setfuncs] = useState([() => { }, () => { }])

    useEffect(() => element && setEl(element), [element])
    useEffect(() => {
        let obs = new ResizeObserver(([observed]) => {
            const processed = Object.fromEntries(Object.entries(queries).map(([name, mediaquery]) => ([name, isTrue(mediaquery, observed.contentRect)])))
            processed != execQueries && setExecQueries(processed)
        })
        obs.observe(el)
        const stopObserving = () => obs.unobserve(el)
        setfuncs([stopObserving, () => obs.observe(el)])
        return stopObserving
    }, [el])
    return [execQueries, funcs[0], funcs[1]]
}


module.exports = useMedia;