const { useEffect, useRef } = require('react')

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
        document.body.addEventListener('click',onClick)
        return ()=>document.body.removeEventListener('click',onClick)
    },[activated])
    return ref
}

module.exports = useClickOutside