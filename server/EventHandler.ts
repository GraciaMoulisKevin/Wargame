

export default class EventHandler {

    private listeners = {};

    public registerListeners(listeners: [{event: string, cb: (eventData) => {}}]) {
        listeners.forEach(listener => {
           if(!this.listeners[listener.event]) {
               this.listeners[listener.event] = [];
           }

            this.listeners[listener.event].push(listener.cb);
        });
    }

    public callEvents(events: [string], eventData?: {}) {
        events.forEach(event => {
           this.listeners[event].cb(eventData);
        });
    }

}
