import fs from "fs";

export class Resource {
    /**
     * Loads a resource from a file
     * @expects file to be a valid path to a file within "./data/" directory, if not it will create the file
     * @param {String} file 
     * @returns {Object} the resource
     */
    constructor(file) {
        this.file = file;
        if (fs.existsSync(`./data/${file}`)) {
            this.resource = JSON.parse(fs.readFileSync(`./data/${ file }`, "utf8"));
        } else {
            this.resource = {};
            fs.writeFileSync(`./data/${ file }`, JSON.stringify(this.resource, null, 4));
        }
    }

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
    get() {
        return this.resource;
    }

}

export const getChannelByID = (id, guild) => {
    return guild.channels.cache.find(c => c.id === id);
}

export const getChannelByName = (name, guild) => {
    return guild.channels.cache.find(c => c.name === name);
}
