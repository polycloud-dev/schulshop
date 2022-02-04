import { useEffect, useState } from "react"
import OutsideClickHandler from 'react-outside-click-handler';

const menuDefaultStyle = {"zIndex": "99999", "transition": "opacity 1s", "display": "flex", "flexDirection": "column", "position": "absolute", "width": "fit-content", "padding": "1rem", "border": "gray solid", "backgroundColor": "white"}
const iconDefaultStyle = {"height": "3rem", "width": "3rem"}

export default function PopupMenu({children, on, atElement, icon, open, onOpenChanged, className, style, menuClassName, menuStyle, iconClassName, iconStyle}) {
    if(!icon) icon = '/icon/menu.svg'
    const menuMergedStyle = atElement === false ? merge(menuDefaultStyle, merge(menuStyle, {"right": "-2rem"})) : merge(menuDefaultStyle, menuStyle);
    const iconMergedStyle = merge(iconStyle, iconDefaultStyle);
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
        <div className={className} style={style}>
            {typeof icon === 'string' ? 
                on === 'hover' ? <img className={iconClassName} style={iconMergedStyle} draggable="false" src={icon} onClick={() => {if(!visible) {changeVisible(true)}}} onMouseEnter={() => changeVisible(true)} onMouseLeave={() => changeVisible(false)}/>
                : <img className={iconClassName} style={iconMergedStyle} draggable="false" src={icon} onClick={() => {if(!visible) {changeVisible(true)}}}/>
            : {icon}}
            {visible && children ? 
                on === 'click' ? <ClickMenu className={menuClassName} style={menuMergedStyle} changeVisible={changeVisible} content={children}/>
                : <Menu className={menuClassName} style={menuMergedStyle} content={children}/>
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