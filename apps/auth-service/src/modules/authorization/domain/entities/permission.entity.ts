export interface PermissionProps {
  id: string;
  code: string;
  name: string;
  description: string | null;
}

export class Permission {
  private constructor(private readonly props: PermissionProps) {}

  static create(props: PermissionProps): Permission {
    if (!props.id.trim()) {
      throw new Error('Permission id cannot be empty');
    }

    if (!props.code.trim()) {
      throw new Error('Permission code cannot be empty');
    }

    if (!props.name.trim()) {
      throw new Error('Permission name cannot be empty');
    }

    return new Permission({
      id: props.id,
      code: props.code,
      name: props.name,
      description: props.description,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description;
  }
}
