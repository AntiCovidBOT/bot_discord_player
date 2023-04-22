export interface EventDiscord {
    name: string;
    once: boolean;
    execute: (...args: any[]) => void;
}

export class EventBot {
    events: EventDiscord[];

    constructor() {
        this.events = [];
    }

    setEventBuild(events: EventDiscord[]) {
        this.events.push(...events)
    }

    get getEvents() {
        return this.events;
    }
}