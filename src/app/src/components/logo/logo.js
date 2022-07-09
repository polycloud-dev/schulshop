import { ReactComponent as SVGLogo } from './logo.svg'

export default function Logo({ height, width, color, size }) {

    return <SVGLogo height={size} width={size} fill={color} />;
}