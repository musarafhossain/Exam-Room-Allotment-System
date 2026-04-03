export abstract class BaseModel {
  public id?: string;
  public _id?: string;
  public created_at?: number | string;
  public updated_at?: number | string;
  public created_by?: string;
  public updated_by?: string;
}