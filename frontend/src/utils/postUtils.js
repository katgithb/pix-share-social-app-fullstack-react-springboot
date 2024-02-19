import { Map } from "immutable";
import { POSTS_DEFAULT_PAGE } from "./constants/pagination/postPagination";
import { getElapsedTimeInSeconds, getRelativeTime } from "./timeUtils";

export const getRelativePostTime = (postTimestamp) => {
  // Calculate the elapsed time between the post timestamp and the current time
  const elapsedTime = getElapsedTimeInSeconds(postTimestamp);

  if (elapsedTime < 60) {
    return "just now";
  }

  if (elapsedTime < 3 * 60) {
    return "a few minutes ago";
  }

  return getRelativeTime(postTimestamp) + " ago";
};

export const isCurrUserPost = (currUserId, postUserId) => {
  return currUserId && postUserId && currUserId === postUserId ? true : false;
};

export const trimPostAttributeCache = (
  cacheMap,
  page,
  minPage,
  maxPage,
  maxCacheSize
) => {
  if (cacheMap.size > maxCacheSize) {
    const pagesToRemove =
      page >= maxPage
        ? new Set([minPage, minPage + 1])
        : new Set([maxPage - 1, maxPage]);

    return cacheMap.filter((_, pageNum) => !pagesToRemove.has(pageNum));
  }

  return cacheMap;
};

export const updatePostAttributeCache = (cacheMap, page, key, value) => {
  const pageMap = cacheMap.get(page) || Map();

  const updatedPageMap = pageMap.set(key, value);

  return cacheMap.set(page, updatedPageMap);
};

export const removePageFromPostAttributeCache = (cacheMap, page) => {
  if (page === POSTS_DEFAULT_PAGE - 1) {
    return Map();
  }

  const pagesToRemove = cacheMap.filter((_, pageNum) => pageNum >= page);

  return cacheMap.filter((_, pageNum) => !pagesToRemove.has(pageNum));
};
