

export default class EventHandler {

    private listeners = {};

    public registerListener(event: string, cb: (eventData: any) => void) {
       if(!this.listeners[event]) {
           this.listeners[event] = [];
       }

        this.listeners[event].push(cb);
    }

    public callEvents(events: [string], eventData?: {}) {
        events.forEach(event => {
           this.listeners[event].forEach(cb => cb(eventData));
        });
    }

}
