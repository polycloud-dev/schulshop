import { ReactComponent as SVGLogo } from './logo.svg'

export default function Logo({ height, width, color }) {

    return <SVGLogo height={height} width={width} fill={color} />;
}