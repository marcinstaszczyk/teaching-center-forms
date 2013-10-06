///<reference path='../node.d.ts' />

export class HTMLParameterProcessor {
  
  res: ExpressServerResponse;
  
  name: String;
  label: String;
  
  raw: String;
  //converted: any;
  
  errors: Array;
  
  constructor(req: ExpressServerRequest, res: ExpressServerResponse, paramName: String) {
    this.res = res;
    this.name = paramName;
    this.label = paramName;
    this.raw = req.body[paramName];
    
  }
  
  setLabel(label: String) {
    this.label = label;
    return this;
  }
  
  addError(description: String) {
    if (!this.errors) {
      if (!this.res.locals.validationErrors) {
        this.res.locals.validationErrors = {};
      }
      this.errors = this.res.locals.validationErrors.name;
      if (!this.errors) {
        this.errors = [];
        this.res.locals.validationErrors.name = this.errors;
      }
    }
    
    this.errors.push(description);
    
    return this;
  }
  
  required() {
    if (!this.raw) {
      this.addError("Wypłenienie pola " + this.label + " jest wymagane");
    }
    
    return this;
  }
  
  maxLength(length: number) {
    if (this.raw && this.raw.length > length) {
      this.addError("Pole " + this.label + " nie może być dłuże niż " + length);
    }
  }
}


export function process(req: ExpressServerRequest, res: ExpressServerResponse, paramName: String) {
  return new HTMLParameterProcessor(req, res, paramName);
}
