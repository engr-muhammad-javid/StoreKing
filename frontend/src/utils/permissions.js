export const hasPermission = (permissions, page, action = 'view') => {
  if (!permissions || !Array.isArray(permissions)) return false;

  const pagePerm = permissions.find((perm) => perm.page?.toLowerCase() === page?.toLowerCase());
  return pagePerm ? !!pagePerm[action] : false;
};
