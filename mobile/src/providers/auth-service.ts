import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AuthService {
data:any;
ip:string;

  constructor(public http: Http) {
     this.data = [];
     if(localStorage.getItem("json") != null &&  localStorage.getItem("json") != undefined && localStorage.getItem("json") != "[]"){
      let datos = JSON.parse(localStorage.getItem("json"));
	    this.ip = datos[0].IpServer+':'+datos[0].PuertoNode;
    }
   // let datos = JSON.parse(localStorage.getItem("json"));
	  //this.ip = datos[0].IpServer+':'+datos[0].PuertoNode;  
  }


  login(credentials) {

    if(localStorage.getItem("json") != null && localStorage.getItem("json") != undefined && localStorage.getItem("json") != "[]"){
      let datos = JSON.parse(localStorage.getItem("json"));
	    this.ip = datos[0].IpServer+':'+datos[0].PuertoNode;
    }

    
    
    var url = `${this.ip}/GetLogin/${credentials.usuario}/${credentials.password}`;
    return new Promise(resolve => {
      this.http.get(url)
        .timeout(5000)
        .map(res => res.json())
        .subscribe(data => {
            if(data.length == 0){
              this.data = [{ Id : null}];
            }else{
              this.data = data;
            }
          resolve(this.data);
          },
          err =>{         
           this.data = [{ Id : -1}];
          resolve(this.data); 
          },
        );
    });
  }

    conf(ip) {
    var url = `${ip}/GetDataConfigApp?call`;
    return new Promise(resolve => {
      this.http.get(url)
        .timeout(5000)
        .map(res => res.json())
        .subscribe(data => {
            if(data.length == 0){
              this.data = [];
            }else{
              this.data = data;
            }
          resolve(this.data);
          },
          err =>{         
           this.data = [];
          resolve(this.data); 
          },
        );
    });
  }



}