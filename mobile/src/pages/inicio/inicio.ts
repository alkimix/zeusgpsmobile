import { Component } from '@angular/core';
import { NavController ,LoadingController, Loading,ModalController,AlertController} from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { HomePage } from '../home/home';
import { TestingPage } from '../testing/testing';
import { Configuracion } from '../configuracion/configuracion';
import { ConductorPage } from '../conductor/conductor';
import { Administrador} from '../administrador/administrador';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
  providers: [AuthService]
})
export class InicioPage {

  registerCredentials = {usuario: '', password: ''};
  loading: Loading;
   

  constructor(public modalCtrl: ModalController,public navCtrl: NavController, private alertCtrl: AlertController, private auth: AuthService, private loadingCtrl: LoadingController) {


    console.log(localStorage.getItem("json"));
     

  }

public login() {
   
    this.showLoading();
    if(this.registerCredentials.usuario != '' && this.registerCredentials.password != ''){
     
        let e = Md5.hashStr(this.registerCredentials.password);
        this.registerCredentials.password = e.toString();
            this.auth.login(this.registerCredentials).then(data => {
                
            this.registerCredentials.password = '';
                setTimeout(() => {             
                 if(data[0].Id == null){
                     this.showError('Usuario Invalido',"Datos invalidos");
                     
                 }else if(data[0].Id == -1){
                    this.showError('Error de conexion',"Tenemos problemas con su conexion");
                 }else{
                   
                     sessionStorage.setItem("datos", JSON.stringify(data));
                     this.loading.dismiss();
                     // this.nav.push(HomePage)
                      console.log(data[0].TipoUser);
                      if(data[0].TipoUser == "P"){
                        this.navCtrl.setRoot(HomePage);     
                      }

                       if(data[0].TipoUser == "T"){
                        this.navCtrl.setRoot(TestingPage);     
                      }

                      if(data[0].TipoUser == "C"){
                        this.navCtrl.setRoot(ConductorPage);     
                      }
                      
                      if(data[0].TipoUser == "A"){
                        this.navCtrl.setRoot(Administrador);     
                      }


                 }
            });  
        })
    }else{
      this.showError('Usuario Invalido','Digite Credenciales de autenticacion');
    }

  }

  openmodalconfig(){

    let profileModal = this.modalCtrl.create(Configuracion);
     profileModal.onDidDismiss(data => {
     console.log(data);
   });
    profileModal.present();

  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Porfavor espere...'
    });
    this.loading.present();
  }
 
  showError(titulo,text) {
    setTimeout(() => {
      this.loading.dismiss();
    });
 
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

}
