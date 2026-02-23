import { UserModel } from '../models/User.js';

export async function listUsers() {
  return UserModel.find().lean();
}

export async function createUser(payload) {
  return UserModel.create(payload);
}
