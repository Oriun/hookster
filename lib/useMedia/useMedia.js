import { useState, useEffect, useRef } from 'react'

const translateToPixel = string => {
    // NOW => only handle pixels value
    // NEXT => handle viewport units
    return parseFloat(string)
}

const isTrue = (mediaquery, element) => {
    if (!mediaquery.includes(':'))
        throw new Error('Unsupported query')
    const [type, value] = mediaquery.split(/ *: */ )
    const pixels = translateToPixel(value)
    switch (type) {
        case 'max-width': return element.inlineSize <= pixels
        case 'min-width': return element.inlineSize >= pixels
        case 'max-height': return element.blockSize <= pixels
        case 'min-height': return element.blockSize >= pixels
        default: return false
    }
}

/**
 * 
 * @param {Object<string, string>} queries 
 * @param {HTMLElement | Node} element 
 * @returns {Object<string, boolean>}
 */
const useMedia = (queries) => {

    const [execQueries, setExecQueries] = useState(queries)
    
    const ref = useRef(null)
    
    useEffect(() => {
    
        if (!ref.current) return
        
        let obs = new ResizeObserver(([{ borderBoxSize, contentRect }]) => {
            /*
            const processed = Object.fromEntries(
                Object.entries(queries).map(
                    ([name, mediaquery]) => ([name, isTrue(mediaquery, borderBoxSize[0] || borderBoxSize || contentRect)])
                )
            )
            Object.entries(processed).map(a => execQueries[a[0]] === a[1]).includes(false) && setExecQueries(processed)
            */
            // NEW PROPOSAL
            let hasChanged = false
            for(const name in queries){
                let s = isTrue(queries[name], borderBoxSize[0] || borderBoxSize || contentRect)
                if(execQueries[name] !== s){
                    hasChanged = true
                    execQueries[name] = s
                }
            }
            if(hasChanged) setExecQueries(execQueries)
            // END OF PROPOSAL
        })
        
        ref.current && obs.observe(ref.current)
        
        return () => obs.disconnect(obs.observe(ref.current))
        
    }, [ref.current, execQueries])
    
    return [execQueries, ref]
}


export default useMedia;
