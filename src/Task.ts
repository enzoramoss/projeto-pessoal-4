export class Task {
  constructor(
    public id: number,
    public title: string,
    public description: string | null = null,
    public done: boolean = false,
    public createdAt: string = new Date().toISOString()
  ) {}

  toggleDone() {
    this.done = !this.done;
  }

  update(data: Partial<Omit<Task, 'id' | 'createdAt'>>) {
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.done !== undefined) this.done = data.done;
  }
}