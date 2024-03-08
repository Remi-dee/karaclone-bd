interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  context: { [key: string]: any };
}
