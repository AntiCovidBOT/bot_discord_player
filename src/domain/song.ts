import {stream, video_basic_info} from "play-dl";
import { YouTube } from 'youtube-sr'
import {videoPattern} from "../utils/patterns";
import {AudioResource, createAudioResource} from "@discordjs/voice";

interface SongData {
    title: string;
    url: string;
    duration: number;
}

export class Song {
    readonly title: string;
    readonly url: string;
    readonly duration: number;

    constructor({ title, url, duration }: SongData) {
        this.title = title;
        this.url = url;
        this.duration = duration;
    }

    static async fromYoutube(urlDiscord: string) {
        const isYoutubeUrl = videoPattern.test(urlDiscord);
        if (isYoutubeUrl) {
            const { video_details: { title, url, durationInSec  } } = await video_basic_info(urlDiscord);
            if (!title || !url || !durationInSec) throw new Error('Song not found');

            return new this({
                title: title,
                url: url,
                duration: durationInSec,
            });
        }

        let songInfo = await YouTube.searchOne(urlDiscord);
        const { video_details: { title, url, durationInSec  } } = await video_basic_info(`https://youtube.com/watch?v=${songInfo.id}`);
        if (!title || !url || !durationInSec) throw new Error('Song not found');

        return new this({
            title: title,
            url: url,
            duration: durationInSec,
        });
    }

    public async makeResource(): Promise<AudioResource<Song> | void> {
        let playStream = await stream(this.url);
        if (!stream) return;

        return createAudioResource(playStream.stream, { metadata: this, inputType: playStream.type, inlineVolume: true });
    }
}