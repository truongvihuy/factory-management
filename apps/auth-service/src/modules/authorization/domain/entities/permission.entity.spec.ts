import { Permission } from './permission.entity';

describe('Permission', () => {
  const validPermission = {
    id: 'permission-1',
    code: 'machine:read',
    name: 'Read Machine',
    description: 'View machine information',
  };

  it('should create a permission', () => {
    const permission = Permission.create(validPermission);

    expect(permission.id).toBe('permission-1');
    expect(permission.code).toBe('machine:read');
    expect(permission.name).toBe('Read Machine');
    expect(permission.description).toBe('View machine information');
  });

  it('should allow null description', () => {
    const permission = Permission.create({
      ...validPermission,
      description: null,
    });

    expect(permission.description).toBeNull();
  });

  it('should reject empty id', () => {
    expect(() =>
      Permission.create({
        ...validPermission,
        id: '',
      }),
    ).toThrow('Permission id cannot be empty');
  });

  it('should reject empty code', () => {
    expect(() =>
      Permission.create({
        ...validPermission,
        code: '',
      }),
    ).toThrow('Permission code cannot be empty');
  });

  it('should reject whitespace-only code', () => {
    expect(() =>
      Permission.create({
        ...validPermission,
        code: '   ',
      }),
    ).toThrow('Permission code cannot be empty');
  });

  it('should reject empty name', () => {
    expect(() =>
      Permission.create({
        ...validPermission,
        name: '',
      }),
    ).toThrow('Permission name cannot be empty');
  });

  it('should reject whitespace-only name', () => {
    expect(() =>
      Permission.create({
        ...validPermission,
        name: '   ',
      }),
    ).toThrow('Permission name cannot be empty');
  });
});
