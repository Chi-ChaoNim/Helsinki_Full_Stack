const getUser = (item) => {
  return window.localStorage.getItem(item);
};

const saveUser = (item, user) => {
  window.localStorage.setItem(item, JSON.stringify(user));
};

const removeUser = (item) => {
  window.localStorage.removeItem(item);
};

export default { getUser, saveUser, removeUser };
