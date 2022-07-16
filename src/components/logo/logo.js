import { ReactComponent as SVGLogo } from './logo.svg'
import { ReactComponent as NoTextLogo } from './logo_notext.svg'

export default function Logo({ color, size, noText }) {
    if(noText) return <NoTextLogo width={size} height={size} fill={color} />
    else return <SVGLogo height={size} width={size} fill={color} />;
}