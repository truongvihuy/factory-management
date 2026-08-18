import { REQUIRED_PERMISSION_KEY, RequirePermission } from './require-permission.decorator';

describe('@RequirePermission', () => {
  it('should attach required permission metadata', () => {
    class TestController {
      @RequirePermission('USER_READ')
      getUsers() {}
    }

    const permission = Reflect.getMetadata(REQUIRED_PERMISSION_KEY, TestController.prototype.getUsers);

    expect(permission).toBe('USER_READ');
  });
});
