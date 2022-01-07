import React, { createContext, useState, useCallback, useContext, useMemo, useEffect, useRef } from "react";

const FeedbackContext = createContext([])

const Success = ({ size, style }) => (
    <svg style={{...style, borderColor: '#b3cf42'}} width={size} height={size} viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.35785 12.366L1.81102 7.81913L0.29541 9.33474L6.35785 15.3972L19.3488 2.40624L17.8332 0.890625L6.35785 12.366Z" fill="#b3cf42" />
    </svg>
)
const Failure = ({ size, style }) => (
    <svg style={{...style, transform: 'rotate(45deg)', borderColor: '#fc6161'}} width={size} height={size} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.53117 0.0397506L6.67075 0.0273438C6.85224 0.0272833 7.028 0.0908849 7.16743 0.207073C7.30685 0.32326 7.40111 0.484672 7.43378 0.663199L7.44618 0.802777V5.45537H12.0988C12.2803 5.45531 12.456 5.51892 12.5955 5.6351C12.7349 5.75129 12.8291 5.9127 12.8618 6.09123L12.8742 6.23081C12.8743 6.4123 12.8107 6.58806 12.6945 6.72749C12.5783 6.86691 12.4169 6.96117 12.2384 6.99383L12.0988 7.00624H7.44618V11.6588C7.44624 11.8403 7.38264 12.0161 7.26645 12.1555C7.15027 12.2949 6.98885 12.3892 6.81033 12.4219L6.67075 12.4343C6.48926 12.4343 6.3135 12.3707 6.17407 12.2545C6.03465 12.1384 5.94039 11.9769 5.90772 11.7984L5.89532 11.6588V7.00624H1.24272C1.06123 7.0063 0.885465 6.9427 0.74604 6.82651C0.606614 6.71032 0.51236 6.54891 0.479692 6.37039L0.467285 6.23081C0.467225 6.04932 0.530826 5.87355 0.647014 5.73413C0.763202 5.5947 0.924614 5.50045 1.10314 5.46778L1.24272 5.45537H5.89532V0.802777C5.89526 0.621286 5.95886 0.445523 6.07505 0.306098C6.19123 0.166673 6.35264 0.0724189 6.53117 0.0397506Z" fill="var(--red-enjoy)" />
    </svg>

)

const FeedbackBoxStyles = (success) => ({
    main: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: 6,
        background: 'white',
        overflow: 'hidden',
        height: 80,
        minWidth: 400,
        maxWidth: 600,
        boxShadow: '0 0 10px rgba(150,150,150,.3)',
        fontFamily: 'var(--montserrat)',
        marginTop: 16,
        opacity:0,
        transitionDuration: '0.2s',
        position: 'relative'
    },
    leftBar: {
        background: success ? 'var(--green-enjoy)' : 'var(--red-enjoy)',
        width: 10,
        height: 80,
        marginRight: 20,
        flexShrink: 0
    },
    icon: {
        borderWidth: 3,
        borderStyle: 'solid',
        padding: 4,
        borderRadius: '50%',
        marginRight: 20,
        flexShrink: 0
    },
    content: {
        padding: "8px 0",
        marginRight: 16,
        flexGrow: 1
    },
    title: {
        fontWeight: 600,
        fontSize: 16,
        color: 'var(--false-black)'
    },
    message: {
        fontWeight: 500,
        fontSize: 14,
        color: 'var(--gray-enjoy)',
    },
    button: {
        height: 80,
        padding: 16,
        width: 80,
        background: 'none',
        border: 'none',
        borderLeft: '1px solid rgba(180,180,180,.2)',
        flexShrink: 0,
        fontFamily: 'var(--montserrat)',
        fontSize: 11,
        fontWeight: 400,
        textTransform: 'uppercase',
        color: 'var(--gray-enjoy)',
    },
    progress: {
        height: 6,
        width: 6,
        position: 'absolute',
        bottom: 0,
        left: 0,
        background: success ? 'var(--green-enjoy)' : 'var(--red-enjoy)',
        boxShadow: '0 0 4px rgba(0,0,0,.2)'
    }
})

const FeedbackBox = ({ id, title, message, success, remove }) => {
    const Styles = useMemo(() => FeedbackBoxStyles(success), [success])
    const ref = useRef(null)
    useEffect(() => {
        const screenTime = 8_000//ms
        const start = Date.now()
        const end = start + screenTime
        setTimeout(() => {
            remove(id)
        }, screenTime)
        ref.current.style.opacity = 1
        const progress = ref.current.children[ref.current.children.length - 1]
        const interval = setInterval(()=>{
            if(!progress) clearInterval(interval)
            progress.style.width = `${100 * (Date.now() - start) / (end - start)}%`
        }, 30)
    }, [])
    return <div style={Styles.main} ref={ref}>
        <div style={Styles.leftBar} />
        {success ? <Success size={20} style={Styles.icon} /> : <Failure size={20} style={Styles.icon} />}
        <div style={Styles.content}>
            <h6 style={Styles.title}>{title}</h6>
            <p style={Styles.message}>{message}</p>
        </div>
        <button style={Styles.button} onClick={() => remove(id)}>close</button>
        <div style={Styles.progress}/>
    </div>
}

export const Provider = ({ children }) => {
    const [feedBacks, setState] = useState([])
    const addFeedBack = ({ title = "", message = "", success = true }) => {
        if (!title && !message) throw new Error('Empty title')
        setState(a => {
            var arr = [...a]
            arr.push({
                id: Date.now() + Math.random().toString()[4],
                title,
                message,
                success
            })
            if (arr.length == 11){
                arr.shift()
            }
            return arr
        })
    }
    const removeFeedBack = useCallback((id) => {
            setState(arr => arr.filter(f => f.id !== id))
    }, [feedBacks])
    return <FeedbackContext.Provider value={{ feedBacks, addFeedBack }}>
        {children}
        <div className="feedback-provider-box" style={{ position: "fixed", bottom: 0, right: 0, padding: 16/*, background: 'red'*/ }}>
            {feedBacks.map(props => <FeedbackBox key={props.id} {...props} remove={removeFeedBack} />)}
        </div>
    </FeedbackContext.Provider>
}

export const useFeedback = () => {
    const context = useContext(FeedbackContext)
    return context.addFeedBack
}

export default useFeedback