export default class GlobalError extends Error{
    statusCode: number;
    details: any;

    constructor(message: string,name:string="Global Error", details:any=null, statusCode:number = 404) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.details = details;
  }
}