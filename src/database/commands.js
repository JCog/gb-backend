import { findOne, find } from './dbBase';
const collection = 'commands';

export const findAllCommands = async () => await find(collection, {});

export const findCommandById = async id => await findOne(collection, { _id: id });
