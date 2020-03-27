

export default class EventHandler {

    private listeners = {};

    public registerListener(event: string, cb: (eventData: any) => void) {
       if(!this.listeners[event]) {
           this.listeners[event] = [];
       }

       this.listeners[event].push(cb);
    }

    public registerListeners(events: object) {
        for(const event of Object.keys(events)) {
            this.registerListener(event, events[event]);
        }
    }

    public callEvents(events: [string], eventData?: {}) {
        events.forEach(event => {
            if(this.listeners[event])
                this.listeners[event].forEach(cb => cb(eventData));
            else
                console.error(`Event ${event} has any callback.`);
        });
    }

}
