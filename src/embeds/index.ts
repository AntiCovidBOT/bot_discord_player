import {EmbedBuilder} from "discord.js";
import { EmbedType } from "../types/embed";

export class Embed {
    title: string;
    description: string;
    color: number;
    footer: any;

    constructor(embed: EmbedType) {
        this.title = embed.title;
        this.description = embed.description;
        this.color = embed.color;
        this.footer = embed.footer;
    }

    build() {
        return new EmbedBuilder()
            .setTitle(this.title)
            .setDescription(this.description)
            .setColor(this.color)
            .setFooter(this.footer);
    }
}