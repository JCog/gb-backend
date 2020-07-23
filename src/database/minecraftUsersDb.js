import { findOne, find } from './dbBase';
const collection = 'minecraft_users';

export const findAllUsers = async () => await find(collection, {});
