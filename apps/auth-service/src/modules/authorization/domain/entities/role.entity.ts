export interface RoleProps {
  id: string;
  name: string;
  description: string | null;
}

export class Role {
  private constructor(private readonly props: RoleProps) {}

  static create(props: RoleProps): Role {
    if (!props.id.trim()) {
      throw new Error('Role id cannot be empty');
    }

    if (!props.name.trim()) {
      throw new Error('Role name cannot be empty');
    }

    return new Role({
      id: props.id,
      name: props.name,
      description: props.description,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description;
  }
}
