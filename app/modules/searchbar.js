import {useState} from "react"

export default function Searchbar({className}) {
    const [hovering, setHovering] = useState(false)
    return (
        <div className={className} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            <input spellCheck="false" onChange={(e) => {if(e.target.value.length > 0) console.log(e.target.value)}} className="focus:outline-none w-full" placeholder="Suchen"></input>
            <img draggable="false" src="/icon/search.svg" style={hovering ? {"opacity": "1"} : {"opacity": "0"}}/>
        </div>
    )
}