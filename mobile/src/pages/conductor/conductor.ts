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
var IdUnico;
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
var options;
var map;
var destino;
var latconductor;
var longconductor;
var ip;
var idRechaza;
var mypasajero = null

@Component({
  selector: 'page-conductor',
  templateUrl: 'conductor.html'

})
export class ConductorPage implements OnInit{
  
   constructor( public alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController) {
    
    
 
   }

 

   ngOnInit() {
       // this.datosurl = JSON.parse(localStorage.getItem("json"));
       //	this.datosurl = this.datosurl[0];
     mydato = JSON.parse(sessionStorage.getItem("datos"));
	 mydato = mydato[0];
	 
	 IdUnico = mydato.Id;	
	 	
	 	
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
                          url: ip+'/GetImgDinamico',
                          scaledSize: new google.maps.Size(32,50),
                          rotation: 45 
                        }
                        });
                }
               
               socketPpal.emit('adduser', {nameUser:mydato.Nombre,IdUser:IdUnico,TipoUser:mydato.TipoUser,latitud:coordenadas.latitude,longitud:coordenadas.longitude,Celular:mydato.Celular,Correo:mydato.Correo});
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
				
				latlng = new google.maps.LatLng(coordenadas.latitude,coordenadas.longitude);
			 if(myimg != null){
      	myimg.setPosition(latlng);
       }
				socketPpal.emit('UpdatePosition', {IdUser:IdUnico,latitud: position.coords.latitude,longitud:position.coords.longitude});		
			
    
  });


    
				socketPpal.on('PasajeroDesconectado', function(data){
				
						if(idRechaza == data.IdPasajero && idRechaza != null){
							   $("#CountDownTimer").TimeCircles().destroy();
							//	$( "#popupDialog" ).popup( "close" );
							alert("pasajero se ha desconectado");
                 setTimeout(() => {             
                          $(".servicio").css("display","none");
                        }); 
								idRechaza = null;
						}
				})
				
				
				socketPpal.on('PasajeroRechazaServicio', function(data){
				
						if(idRechaza == data.IdPasajero && idRechaza != null){
							  $("#CountDownTimer").TimeCircles().destroy();
						   setTimeout(() => {             
                          $(".servicio").css("display","none");
                        }); 
								alert("pasajero rechaza servicio");
								idRechaza = null;
						}
				})

    socketPpal.on('PeticionServicio', function(data){
					
				 $(".servicio").css("display","block");
					//	$( "#popupDialog" ).popup( "open" );
					
						   mypasajero = data;
							idRechaza = data.IdPasajero;
							$("#nomdestino").html("Destino: "+labels[data.Destino]);
							$("#distancia").html(mypasajero.Distancia+' Km');
							 
							if(mypasajero.Distancia > 3){
								map.setZoom(10); 
							}
							if(mypasajero.Distancia > 8){
								map.setZoom(2); 
							}	
							if(mypasajero.Distancia > 5){
								map.setZoom(3); 
							}
							 
							
							
							   $("#CountDownTimer").TimeCircles().destroy();
							   $("#CountDownTimer").data('timer','30');
							   $("#CountDownTimer").TimeCircles({ time: { Days: { show: false }, Hours: { show: false }, Minutes: { show: false } ,Seconds: { color: "rgb(76, 175, 80)" } } , count_past_zero: false}).addListener(function(unit, value, total){
											
										if(value == 5){
										
											  $("#CountDownTimer").TimeCircles({ time:{ Seconds: { color: "red" } } } );
										
										}
								
										if(value == 10){
										
											  $("#CountDownTimer").TimeCircles({ time:{ Seconds: { color: "yellow" } } } );
										
										}
								
										if(value == 0){
                      
											

                        setTimeout(() => {             
                          $(".servicio").css("display","none");
                        }); 


											  socketPpal.emit('ConductorRechazaServicio',{IdPasajero:data.IdPasajero});
												idRechaza = null;
										};
							   
							   });
					    
					 
					 
			});
		
 

 


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

/*
			socketPpal.on('RemoveObjetoDinamico', function(data){
					if(data.IdUser != undefined){ 
              _arrayDinamic[data.IdUser].setMap(null);
              delete _arrayDinamic[data.IdUser];
            }
			});
		

      socketPpal.on('GetObjetosDinamicos', function(data){
        	console.log("llego conductor");
			console.log(myconductor);
          let node;
          
      if(myconductor == null){
			for(var i in data.Posiciones ){
				
				 node = data.Posiciones[i];
				 node = node[0];
				
				if( _arrayDinamic[node.IdUser] == undefined && IdUnico != node.IdUser){
 
						  _arrayDinamic[node.IdUser] = new google.maps.Marker({
							position : new google.maps.LatLng(node.latitud,node.longitud),
							map: map,
							icon: {
								url: ip+'/GetImgDinamico',
								scaledSize: new google.maps.Size(32,50),
								rotation: 45 
							}
						  });

				}else{
				
					if(IdUnico != node.IdUser){
						var latlng = new google.maps.LatLng(node.latitud,node.longitud);
						_arrayDinamic[node.IdUser].setPosition(latlng);
					}

				}
				  
			}
	}else{
	
          node = data.Posiciones ;
          node = node[2][0];
          console.log("conductor");
          console.log( data.Posiciones);
		if(_arrayDinamic[node.IdUser] != undefined){
			if(IdUnico != node.IdUser){

          latconductor  = node.latitud;
          longconductor = node.longitud;

				var latlng = new google.maps.LatLng(node.latitud,node.longitud);
				_arrayDinamic[node.IdUser].setPosition(latlng);
			}
		}
		
	}
			 
		
		});*/
		

//***********************************************************************************/


  document.getElementById("desactivar").addEventListener("click", function(){
      socketPpal.emit('ActivarServicioConductor', {});
       $("#activar").css("display","block");
       $("#desactivar").css("display","none");
    });


  document.getElementById("activar").addEventListener("click", function(){
     socketPpal.emit('DesactivarServicioConductor', {});	
        $("#desactivar").css("display","block");
        $("#activar").css("display","none");
        
    });


    document.getElementById("activar_servicio").addEventListener("click", function(){
        
        socketPpal.emit('ConductorAceptaServicio',{IdPasajero:idRechaza});
         // console.log(idRechaza);
				  //console.log(mypasajero);
					idRechaza = null;
         $(".servicio").css({display:"none"});
				  $(".inicio").css({display:"none"});
          $(".conductor").css({display:"block"});
          $("#nomconductor").html(mypasajero.NomPasajero);
          $("#imgconductor").attr("src",ip+"/GetFotoUsuario/"+mypasajero.IdPasajero);
					$("#celu").html(mypasajero.CelularPasajero)  
				
 
	 


    });





 
 

 document.getElementById("menu").addEventListener("click", function(){
        $(".inicio").css({display:"none"});
        $(".conductor").css({display:"block"});
    });


 document.getElementById("llamar").addEventListener("click", function(){
            location.href = "tel:+573008686957"
    });


 document.getElementById("locationconductor").addEventListener("click", function(){
      if(latconductor != undefined && longconductor != undefined){
          let center = new google.maps.LatLng(latconductor,longconductor);
          map.panTo(center);
      }
    });


 document.getElementById("cancelar_servicio").addEventListener("click", function(){
       $(".servicio").css({display:"none"});
       	socketPpal.emit('ConductorRechazaServicio',{IdPasajero:idRechaza});
		idRechaza = null;
    });
 
 
 document.getElementById("locacion").addEventListener("click", function(){
        let center = new google.maps.LatLng(coordenadas.latitude,coordenadas.longitude);
        map.panTo(center);
    });

    

}



	 error(error){
		 if(error.code == 3){ 
			alert("active su posicion")
		 };
	 }


 

   

}
