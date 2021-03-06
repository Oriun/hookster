import { useEffect, useRef } from 'react'

const flatChildren = elem =>{
    var child = [...elem.children]
    child.push(...child.flatMap(flatChildren))
    return child
}

function useClickOutside(activated, action){
    const ref = useRef(null)
    useEffect(()=>{
        if(!activated) return
        function onClick(e){
            if(!ref.current) return
            const children = flatChildren(ref.current)
            const target = e.target
            if(!children.includes(target)){
                action()
            }
        }
        document.body.addEventListener('mouseup',onClick)
        return ()=>document.body.removeEventListener('mouseup',onClick)
    },[activated])
    return ref
}

export default useClickOutside