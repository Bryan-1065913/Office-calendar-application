// /src/pages/Events/Events.tsx

import GreetingMessage from "../../components/common/Dashboard/GreetingMessage.tsx";

function events() {
    return (
        <div>
            <GreetingMessage meetings={3} events={2} tasks={5} />
        </div>
    );
}

export default events;