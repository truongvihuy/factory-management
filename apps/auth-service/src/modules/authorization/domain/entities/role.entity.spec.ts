import { Role } from './role.entity';

describe('Role', () => {
  it('should create a role', () => {
    const role = Role.create({
      id: 'role-1',
      name: 'FACTORY_MANAGER',
      description: 'Factory manager',
    });

    expect(role.id).toBe('role-1');
    expect(role.name).toBe('FACTORY_MANAGER');
    expect(role.description).toBe('Factory manager');
  });

  it('should allow a role without description', () => {
    const role = Role.create({
      id: 'role-1',
      name: 'OPERATOR',
      description: null,
    });

    expect(role.description).toBeNull();
  });

  it('should reject empty role id', () => {
    expect(() =>
      Role.create({
        id: '',
        name: 'OPERATOR',
        description: null,
      }),
    ).toThrow('Role id cannot be empty');
  });

  it('should reject empty role name', () => {
    expect(() =>
      Role.create({
        id: 'role-1',
        name: '',
        description: null,
      }),
    ).toThrow('Role name cannot be empty');
  });

  it('should reject whitespace-only role name', () => {
    expect(() =>
      Role.create({
        id: 'role-1',
        name: '   ',
        description: null,
      }),
    ).toThrow('Role name cannot be empty');
  });
});
