export class SeoEntity {
  title: string;
  description: string | null;
  keywords: string[];

  constructor(title: string, description: string | null, keywords: string[]) {
    this.title = title;
    this.description = description;
    this.keywords = keywords;
  }
}
