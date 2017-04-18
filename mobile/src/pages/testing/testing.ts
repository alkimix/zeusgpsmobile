import { Component ,OnInit,ViewChild  } from '@angular/core';
import { NavController, NavParams,LoadingController, Loading,AlertController} from 'ionic-angular';
import * as io from 'socket.io-client';
declare var $: any;
declare var google: any;
var labels = [];
var numerodellamados;
var datos = [];
var marker;
var latlng;
var coordenadas;
var cityCircle2
var cityCircle1
var IdUnico = 1;
var	mydato;
var	myimg;
var	_arrayGolf=[];
var	_arrayGolfOld = [];
var	_arrayDinamicOld = [];
var	_arrayDinamic= [];
var datosurl;
var	ultimal;
var	ultimalog;
var	socketPpal;
var	myconductor= null;
var options;
var map;
var destino;
var latconductor;
var longconductor;
var ip;
var segimiento;
var rutas = [];
@Component({
  selector: 'testing-home',
  templateUrl: 'testing.html'

})
export class TestingPage implements OnInit{
  
   constructor( public alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController) {}

 

   ngOnInit() {
       // this.datosurl = JSON.parse(localStorage.getItem("json"));
       //	this.datosurl = this.datosurl[0];
    
    let datos = JSON.parse(localStorage.getItem("json"));
    if(datos.length != 0){
	    ip = datos[0].IpServer+':'+datos[0].PuertoNode;
    }

      options = {
                enableHighAccuracy: true,
                timeout: 6000,
                maximumAge: 3000
      };
					

    socketPpal = io(ip);
     

     socketPpal.on('connect', function () {

        
				// llama al lado del servidor, funcion 'adduser' y envia un parametro (valor del prompt)				
          	//	socketPpal.emit('adduser', {nameUser:'Alexg',IdUser:IdUnico,TipoUser:mydato.TipoUser,latitud:0,longitud:0});		
	      	navigator.geolocation.getCurrentPosition( function(position){
          coordenadas =  position.coords;

                var mapOptions = {
                        zoom: 17,
                        center: new google.maps.LatLng(coordenadas.latitude,coordenadas.longitude),
                        mapTypeId: google.maps.MapTypeId.TERRAIN,
                        panControl: false,
                        zoomControl: false,
                        mapTypeControl: false,
                        scaleControl: false,
                        streetViewControl: false,
                        overviewMapControl: false,
                        rotateControl: true
                  };

                  map = new google.maps.Map(document.getElementById('map'), mapOptions);
           
  
                
              // this.coordenadas = position.coords;
              
                ultimal = coordenadas.latitude;
                ultimalog = coordenadas.longitude;
                if(myimg == null){
                    myimg = new google.maps.Marker({
                        position : new google.maps.LatLng(coordenadas.latitude,coordenadas.longitude),
                        map: map,
                        icon: {
                          url: ip+'/GetImgPersona',
                          scaledSize: new google.maps.Size(32,50),
                          rotation: 45 
                        }
                        });
                }
               
                socketPpal.emit('adduser', {nameUser:'ALEX',IdUser:'1',TipoUser:'1',latitud:coordenadas.latitude,longitud:coordenadas.longitude,Celular:'0',Correo:'<'});
                //socketPpal.emit('UpdatePosition', {IdUser:IdUnico,latitud:coordenadas.latitude,longitud:coordenadas.longitude});

                let center = new google.maps.LatLng(coordenadas.latitude,coordenadas.longitude);					
            
               map.panTo(center);
 
     }, function(){

        alert("hemos tenido problemas iniciando la aplicacion cierre e intente nuevamente.");
        $("#map").html("<p>GPS desactivado</p>");
     }, options );
              
				
		});



    navigator.geolocation.watchPosition(function(position) {
		
			    coordenadas = position.coords;
		
					 ultimal = coordenadas.latitude;
					 ultimalog = coordenadas.longitude;

           rutas.push({latitud:ultimal,longitud:ultimalog});
				
				latlng = new google.maps.LatLng(coordenadas.latitude,coordenadas.longitude);
			 if(myimg != null){
      	myimg.setPosition(latlng);
       }
				socketPpal.emit('UpdatePosition', {IdUser:IdUnico,latitud: position.coords.latitude,longitud:position.coords.longitude});		
			
    
  });


    socketPpal.on('ReintentarSolicitudConductor', function(data){
					 numerodellamados++;
					 //$("#numerodelcarro").html(numerodellamados);
					 socketPpal.emit('SolicitarConductor', {latitud:ultimal,longitud:ultimalog,Destino:destino ,borra:0});
			});


      socketPpal.on('ServicioAceptado', function(data){
				   myconductor = data;	
          $(".inicio").css({display:"none"});
          $(".conductor").css({display:"block"});
          $(".buscar").css({display:"none"});
          $("#nomconductor").html(myconductor.NomConductor);
          $("#imgconductor").attr("src",ip+"/GetFotoUsuario/"+myconductor.IdConductor);
          console.log(data);
          socketPpal.emit('CargarDinamico',{});

				//	$.mobile.changePage( "#popupDialogYo", { role: "dialog" } );
				//	$("#nombreconductor").html(myconductor.NomConductor);
				//	$(".avatar").attr('style',"background-image: url('"+datosurl.IpServer+':'+datosurl.PuertoNode+"/GetFotoUsuario/"+myconductor.IdConductor+"');");
				//	$("#celularPasajero").html(myconductor.CelularConductor)
				//	$("#popupDialog").popup("close");
				//	$("#popupDialogYo").popup("open");
				//	$('.zmdi-directions-car').parent().attr({'style':'background-color:#4caf50'});
					 
					
			});



	socketPpal.on('ConductoresNoDisponibles', function(d){     
      	if(myconductor == null){
				 
				     setTimeout(() => {
                  alert("No hay conductores disponibles, intente mas tarde"); 
                  $(".buscar").css({display:"none"});
            }, 3000);
         
           

					//	$( "#popupDialog" ).popup( "close" );
				}		
					//$( "#msgd" ).popup( "open" );
			});



      socketPpal.on('NroConductoresDisponibles', function(data){
			
			//	$("#cantidad_vehicular").html(data.NroConductoresDisponibles);
			
			
			})



      socketPpal.on('GetObjetosMapa', function(data){
			let d = data.ObjetosMapa;
      console.log(d);
			for(let i in _arrayGolfOld ){
				let id = _arrayGolfOld[i]
			
				if(id != undefined){
					_arrayGolf[id].setMap(null);
				}


			}
			
			
			$.each(d,function(i,obj){
				datos.push({"label": obj.Nombre, "value": obj.Id})
				labels[obj.Id] = obj.Nombre;

				_arrayGolfOld[i] = obj.Id;
				_arrayGolf[obj.Id] =  new google.maps.Marker({
						position : new google.maps.LatLng(obj.Latitud,obj.Longitud),
						map: map,
						 animation: google.maps.Animation.DROP,
						label: {
						 
							text: labels[obj.Id],
							color: "#07528d",
							fontSize: "16px",
							fontWeight: "bold",
							position: "absolute"
						  },
						icon: {
							url: ip+'/getimgObjeto/'+obj.Id,
							scaledSize: new google.maps.Size(22, 22),
							rotation: 45,
							
						}
					  });
					  
				
			})
			
			 
			
		});


			socketPpal.on('RemoveObjetoDinamico', function(data){
					if(data.IdUser != undefined){ 
              _arrayDinamic[data.IdUser].setMap(null);
              delete _arrayDinamic[data.IdUser];
           }
			});
		

       
		

//***********************************************************************************/

  

 document.getElementById("pin").addEventListener("click", function(){
       
        $(".segimiento").css({display:"none"});
        segimiento = 0;
        for(let i in rutas){
          	  _arrayDinamic[i] = new google.maps.Marker({
							position : new google.maps.LatLng(rutas[i].latitud,rutas[i].longitud),
							map: map,
						  label:i
              
						  });
        }

        

    });


document.getElementById("eye").addEventListener("click", function(){
 

       if(segimiento == 0){
         console.log(rutas);
        for(let i in rutas){
          
                  _arrayDinamic[i].setMap(null);
                  delete _arrayDinamic[i];
                  
        }
      }

        $(".segimiento").css({display:"block"});
        segimiento = 1;
         
        rutas.splice(0, rutas.length);
    });

 

}



	 error(error){
		 if(error.code == 3){ 
			alert("active su posicion")
		 };
	 }


 

   

}
