import { Role } from './role.entity';

describe('Role', () => {
  const validRole = {
    id: 'role-1',
    code: 'FACTORY_MANAGER',
    name: 'Factory Manager',
    description: 'Manages factory operations',
  };

  it('should create a role', () => {
    const role = Role.create(validRole);

    expect(role.id).toBe('role-1');
    expect(role.code).toBe('FACTORY_MANAGER');
    expect(role.name).toBe('Factory Manager');
    expect(role.description).toBe('Manages factory operations');
  });

  it('should allow null description', () => {
    const role = Role.create({
      ...validRole,
      description: null,
    });

    expect(role.description).toBeNull();
  });

  it('should reject empty id', () => {
    expect(() =>
      Role.create({
        ...validRole,
        id: '',
      }),
    ).toThrow('Role id cannot be empty');
  });

  it('should reject empty code', () => {
    expect(() =>
      Role.create({
        ...validRole,
        code: '',
      }),
    ).toThrow('Role code cannot be empty');
  });

  it('should reject whitespace-only code', () => {
    expect(() =>
      Role.create({
        ...validRole,
        code: '   ',
      }),
    ).toThrow('Role code cannot be empty');
  });

  it('should reject empty name', () => {
    expect(() =>
      Role.create({
        ...validRole,
        name: '',
      }),
    ).toThrow('Role name cannot be empty');
  });

  it('should reject whitespace-only name', () => {
    expect(() =>
      Role.create({
        ...validRole,
        name: '   ',
      }),
    ).toThrow('Role name cannot be empty');
  });
});
