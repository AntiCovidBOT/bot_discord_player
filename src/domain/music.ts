import {Song} from "./song";
import {
    AudioPlayer, AudioPlayerState,
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    NoSubscriberBehavior,
    VoiceConnection
} from "@discordjs/voice";
import {bot} from "../index";
import {QueueOptions} from "../ interfaces/queueOptions";

export default class Music {
    readonly connection: VoiceConnection;
    readonly player: AudioPlayer;
    readonly bot = bot;

    resource: AudioResource;
    songs: Song[] = [];
    volume = 100;

    constructor(options: QueueOptions) {
        Object.assign(this, options);

        this.player = createAudioPlayer({ behaviors: {noSubscriber: NoSubscriberBehavior.Play} });
        this.connection.subscribe(this.player);

        this.player.on("stateChange" as any, async (oldState: AudioPlayerState, newState: AudioPlayerState) => {
            if (oldState.status !== AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Idle) {
                if (this.songs.length) {
                    this.songs.shift();
                }

                this.songs.push(this.songs.shift()!);
                console.log(`Added...`);
                console.log(this.songs)
                if (this.songs.length || this.resource.audioPlayer) this.processQueue();
            }

            if (oldState.status === AudioPlayerStatus.Buffering && newState.status === AudioPlayerStatus.Playing) {
                console.log(`Playing...`);
                console.log(this.songs)
            }
        });
    }

    public enqueue(...songs: Song[]) {
        this.songs = this.songs.concat(songs);
        this.processQueue();
    }

    public async processQueue(): Promise<void> {
        if (this.player.state.status !== AudioPlayerStatus.Idle) {
            return;
        }

        const next = this.songs[0];
        try {
            const resource = await next.makeResource();

            this.resource = resource!;
            this.player.play(this.resource);
            this.resource.volume?.setVolumeLogarithmic(this.volume / 100);
        } catch (error) {
            console.error(error);

            return this.processQueue();
        }
    }
}