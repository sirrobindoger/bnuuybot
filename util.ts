import fs from "fs";
import {Bot} from "./bot";

export class Resource {
    resource: any;
    file: string;
    /**
     * Loads a resource from a file
     * @expects file to be a valid path to a file within "./data/" directory, if not it will create the file
     * @param {String} file 
     * @returns {Object} the resource
     */
    constructor(file : string) {
        this.file = file;
        if (fs.existsSync(`./data/${file}`)) {
            this.resource = JSON.parse(fs.readFileSync(`./data/${ file }`, "utf8"));
        } else {
            this.resource = {};
            fs.writeFileSync(`./data/${ file }`, JSON.stringify(this.resource, null, 4));
        }
    }

    // default get returns the resource


    /**
     * Saves the resource to the file
     * @returns {void}
     * @example
     * const resource = new Resource("test.json");
     * resource.resource.test = "test";
     * resource.save();
     */
    save() {
        fs.writeFileSync(`./data/${ this.file }`, JSON.stringify(this.resource, null, 4));
    }

    /**
     * Get resource
     * 
     * @returns {Object} the resource
     **/
    get(value : string) {
        return this.resource[value];
    }

    /**
     * Set resource
     * 
     * @param {String} key
     * @param {Object} value
     * @returns {void}
     **/
    set(key : string, value : any) {
        this.resource[key] = value;
        this.save();
    }

}

export const getChannelByID = (id : string) => (
    Bot.guilds.cache.get(process.env.GUILD_ID || "")?.channels.cache.get(id)
)

export const getChannelByName = (name : string) => (
    Bot.guilds.cache.get(process.env.GUILD_ID || "")?.channels.cache.find(channel => channel.name === name)
)
