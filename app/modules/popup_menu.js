import { useEffect, useState } from "react"
import OutsideClickHandler from 'react-outside-click-handler';

const defaultStyle = {"zIndex": "99999", "transition": "opacity 1s", "display": "flex", "flexDirection": "column", "position": "absolute", "width": "fit-content", "padding": "1rem", "border": "gray solid", "backgroundColor": "white"}

export default function PopupMenu({children, on, atElement, open, onOpenChanged, className, style}) {
    var icon = <img style={{"height": "3rem", "width": "3rem"}} draggable="false" src='/icon/menu.svg'/>
    if(children[0].props.id === 'icon') {
        icon = children[0]
        children = children.slice(1);
    }
    const mergedStyle = atElement === false ? merge(defaultStyle, merge(style, {"right": "-2rem"})) : merge(defaultStyle, style);
    const [visible, setVisible] = useState(false)
    if(on === undefined) on = 'click'
    function changeVisible(value) {
        setVisible(value)
        if(typeof onOpenChanged === 'function') onOpenChanged(value)
    }
    useEffect(() => {
        changeVisible(open);
    }, [open])
    return (
        <div>
            {
                on === 'hover' ? <div onClick={() => {if(!visible) {changeVisible(true)}}} onMouseEnter={() => changeVisible(true)} onMouseLeave={() => changeVisible(false)}>{icon}</div>
                : <div onClick={() => {if(!visible) {changeVisible(true)}}}>{icon}</div>
            }
            {visible && children ? 
                on === 'click' ? <ClickMenu className={className} style={mergedStyle} changeVisible={changeVisible} content={children}/>
                : <Menu className={className} style={mergedStyle} content={children}/>
            : null}
        </div>
    )
}

function ClickMenu({className, style, content, changeVisible}) {
    return (
        <OutsideClickHandler onOutsideClick={() => setTimeout(() => changeVisible(false), 10)}>
            <Menu className={className} style={style} content={content} />
        </OutsideClickHandler>
    )
}

function Menu({className, style, content}) {
    return (
        <nav className={className} style={style}>
            {content}
        </nav>
    )
}

function merge(obj1, obj2) {
    const result = {};
    if(obj1) Object.keys(obj1).forEach(key => result[key] = obj1[key]);
    if(obj2) Object.keys(obj2).forEach(key => result[key] = obj2[key]);
    return result;
}