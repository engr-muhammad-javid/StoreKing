// src/hooks/useHasPermission.js
import { useSelector } from 'react-redux';

const useHasPermission = (page, action) => {
  const permissions = useSelector((state) => state.auth.permissions);

  const perm = permissions?.find((p) => p.page === page);
  return perm?.[action] ?? false;
};

export default useHasPermission;
