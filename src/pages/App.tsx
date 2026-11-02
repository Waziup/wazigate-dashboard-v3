import { useLocation } from 'react-router-dom'
import { withBasePath } from '../constants';

// The app is rendered from this path (e.g. /apps/waziup.wazigate-system or
// /apps/waziup.wazigate-system/net/wifi). It is routed to the gateway as is,
// with the sub-path the dashboard is served from in front of it.
//
// The trailing slash is kept on purpose: the gateway strips /apps/<id> and
// forwards the rest to the app, so /apps/<id>/docs must reach the app as
// "docs/" - without the slash the app answers 502 ("This app is not running").
export default function AppUI() {
    const { pathname, search, hash } = useLocation()
    const src = pathname + search + hash
    return (
        <iframe src={withBasePath(src)} title="Apps" width="100%" height="100%"></iframe>
    )
}
