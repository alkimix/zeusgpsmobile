import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,AlertController,LoadingController,Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
declare var cordova:any;
 
/**
 * Generated class for the Configuracion page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
  providers: [AuthService]
})
export class Configuracion {

public local:Storage; 
public loading: Loading;
public ip:string;
  constructor(public navCtrl: NavController, private auth: AuthService, private alertCtrl: AlertController, public navParams: NavParams,public viewCtrl: ViewController, private loadingCtrl: LoadingController) {
	 
     if(localStorage.getItem("json") != null && localStorage.getItem("json") != undefined && localStorage.getItem("json") != "[]"){
      let datos = JSON.parse(localStorage.getItem("json"));
	    this.ip = datos[0].IpServer+':'+datos[0].PuertoNode;
    }


	  //console.log(datos);
 }

 dismiss() {  
   this.viewCtrl.dismiss();
 }

cargarip(){
 
	
    this.loading = this.loadingCtrl.create({
      content: 'Porfavor espere...'
    });
    this.loading.present();

   if(this.ip != undefined && this.ip !=""){
		this.auth.conf(this.ip).then(data => {  
			 
					setTimeout(() => {
					                   
							localStorage.setItem("json",JSON.stringify(data));
							let alert = this.alertCtrl.create({
							title: "Mensaje",
							subTitle: "Datos guardados ",
							buttons: ['OK']
							});
							alert.present();
						
						this.loading.dismiss();
					});  
				})
	}else{
		
	let alert = this.alertCtrl.create({
      title: "Mensaje",
      subTitle: "Digite informacion ",
      buttons: ['OK']
    });
 	alert.present();
    this.loading.dismiss();
	}
}

	barcode(){
		setTimeout(function(){ 
		cordova.plugins.barcodeScanner.scan(
			function (result) {
			if(!result.cancelled)
			{
				if(result.format == "QR_CODE")
					{								 
						alert( JSON.parse(result.text) );
					}
			}
		},function (error) {}
		);
		}, 1000);
	}




}
