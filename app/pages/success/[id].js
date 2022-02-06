export default function Success({id}) {
    return (
        <div>
            <h1>Gekauft!</h1>
            <h2>Nummer: {id}</h2>
            <h4>Nummer benötigt, um Produkte in der Schule abzuholen!</h4>
        </div>
    )
}

import sessions from '../../backend/sessions'

export async function getServerSideProps(context) {
    const sessionId = context.query.id;
    const session = await new sessions.timedTask(() => {
        return sessions.get(sessionId)
    }).start();
    if(session instanceof Error) {
        if(session.id === 'timeout') return {"props": {}, "redirect": {"destination": `/error/database-timeout?from=/success/${sessionId}`, "permanent": false}}
        else if(session.id === 'session-notfound') return {"props": {}, "redirect": {"destination": `/error/session-notfound?from=/success/${sessionId}`, "permanent": false}}
        else {
            logClient.error(session);
            return {"props": {}, "redirect": {"destination": `/error/unknown?from=/success/${sessionId}`, "permanent": false}}
        }
    }
    if(session.state === 'completed') return {"props": {"id": session.shortId}}
    else return {"props": {}, "redirect": {"destination": `/checkout/${sessionId}`, "permanent": false}}
}