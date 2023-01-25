import { BaseAuthUser, UserStore } from '../models/user';

const userStore = new UserStore();



  async function createUser(user: BaseAuthUser) {
    return userStore.create(user);
  }

  async function deleteUser(id: number) {
    return userStore.deleteUser(id);
  }

  it('should have getUser method', () => {
    expect(userStore.getUser).toBeDefined();
  });

  it('should have a show method', () => {
    expect(userStore.read).toBeDefined();
  });

  it('should have a create method', () => {
    expect(userStore.create).toBeDefined();
  });

  it('should have a remove method', () => {
    expect(userStore.deleteUser).toBeDefined();
  });

 

