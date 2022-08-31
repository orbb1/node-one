export const formatDate = (date: Date) => date.toDateString();

export const getSortParams = (sort: string) => {
  const [sortParam, sortValue] = sort.split(':');

  return { [sortParam]: sortValue };
};
