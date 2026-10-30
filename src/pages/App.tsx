import { useLocation } from 'react-router-dom'
import { withBasePath } from '../constants';

const removeTrailingSlash = (path: string) =>
    path.length > 1 ? path.replace(/\/+$/, '') : path

// The app is rendered from this path (e.g. /apps/waziup.wazigate-system or
// /apps/waziup.wazigate-system/net/wifi). It is routed to the gateway as is,
// with the sub-path the dashboard is served from in front of it.
export default function AppUI() {
    const { pathname, search, hash } = useLocation()
    const src = removeTrailingSlash(pathname) + search + hash
    return (
        <iframe src={withBasePath(src)} title="Apps" width="100%" height="100%"></iframe>
    )
}
