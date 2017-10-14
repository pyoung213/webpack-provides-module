const _ = require("lodash");
const fs = require("fs");
const resolvePath = require("path").resolve;

/* eslint-disable no-console */

const providesModulePattern = /@providesModule\s(\S+)/;

module.exports = {
    discover,

    _walkTree,
    _isOnBlacklist,
    _isCorrectFileType
};

function discover(options) {
    if (!_.isArray(options.fileTypes)) {
        console.log("FileTypes is Not an Array");

        return;
    }

    if (!options.fileTypes) {
        console.log("No File Type Specified");

        return;
    }

    this.options = options;
    this.modules = {};
    this.fileTypes = options.fileTypes;

    console.log("Crawling File System");
    console.time("Crawling File System (Elapsed)");

    _.each(this.options.roots, path => this._walkTree(path));

    console.timeEnd("Crawling File System (Elapsed)");

    return this.modules;
}

function _walkTree(path) {
    const stat = fs.statSync(path);

    if (stat.isDirectory()) {
        const entries = fs.readdirSync(path);

        _.each(entries, (entry) => {
            if (!this._isOnBlacklist(entry)) {
                this._walkTree(resolvePath(path, entry));
            }
        });

        return;
    }

    if (!stat.isFile() || !this._isCorrectFileType(path)) {
        return;
    }

    const content = fs.readFileSync(path, "utf-8");
    const parts = content.match(providesModulePattern);
    if (!parts) {
        return;
    }

    const moduleName = parts[1];
    const existingModulePath = this.modules[moduleName];
    if (existingModulePath && existingModulePath !== path) {
        const lines = [
            `Duplicated module ${moduleName}`,
            `    ${existingModulePath}`,
            `    ${path}`
        ];

        console.error(lines.join("\n"));

        return;
    }

    this.modules[moduleName] = path;
}

function _isCorrectFileType(path) {
    return _.some(this.fileTypes, (file) => {
        return path.endsWith(file);
    });
}

function _isOnBlacklist(path) {
    return _.some(this.options.blacklist, (entry) => {
        return !_.isNil(path.match(entry));
    });
}
