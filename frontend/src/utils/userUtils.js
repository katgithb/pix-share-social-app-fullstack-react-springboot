export const isCurrUser = (currUserId, userId) => {
  return currUserId && userId && currUserId === userId ? true : false;
};
