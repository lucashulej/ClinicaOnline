import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TurnosService } from 'src/app/servicios/turnos.service';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from 'src/app/servicios/auth.service';
import { Turno } from 'src/app/clases/turno';
import { Usuario } from 'src/app/clases/usuario';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-atender-profesional',
  templateUrl: './atender-profesional.component.html',
  styleUrls: ['./atender-profesional.component.scss']
})
export class AtenderProfesionalComponent implements OnInit {

  @Output() exito: EventEmitter<any> = new EventEmitter();
  @Output() cancelar: EventEmitter<any> = new EventEmitter();
  @Output() error: EventEmitter<any> = new EventEmitter();

  usaurios: Observable<any[]>;
  listaUsuarios: any[];
  turnos: Observable<any[]>;
  listaTurnos: any[];
  turno: Turno = new Turno();
  miUsuario:Usuario;
  hoy: Date = new Date();
  vistaAtenderPaciente = "Turnos";

  constructor(private db : AngularFireDatabase, private turnosService:TurnosService, private authService:AuthService, private datePipe : DatePipe) { 
    this.authService.obtenerUsuario().then((usuarioFire:any)=>{
      this.usaurios = this.db.list('usuarios').valueChanges(); 
      this.usaurios.subscribe(usaurios => {      
        this.listaUsuarios = usaurios;
        for (const usuario of this.listaUsuarios) {
          if(usuario.id == usuarioFire.uid) {
            this.miUsuario = usuario;
            break;
          }
        }
        this.turnos = this.db.list('turnos').valueChanges(); 
        let fechaAux = new Date(); 
        this.turnos.subscribe(turnos => {
          this.listaTurnos = turnos;
          this.listaTurnos = this.listaTurnos.filter(turno => {
            if(turno.idProfesional == this.miUsuario.id && turno.estado == "Aceptado") {
              //let fechaAuxTurno = new Date(turno.fecha);
              //fechaAuxTurno.setDate(fechaAuxTurno.getDate()+1);
              let auxHoy = new Date();
              let hoy = this.datePipe.transform(auxHoy, "yyyy-MM-dd");
              //if(fechaAuxTurno.getFullYear() == fechaAux.getFullYear() && fechaAuxTurno.getMonth() == fechaAux.getMonth() && fechaAuxTurno.getDate() == fechaAux.getDate()) {
                //return turno;
              //} 
              if(hoy == turno.fecha) {
                return turno;
              }
            }
          });
        }, error => console.log(error));
      }, error => console.log(error));
    }).catch((error:any)=>console.log(error));
  }

  ngOnInit(): void {}

  atenderTurno(turno:Turno) {
    this.turno = turno;
    this.vistaAtenderPaciente = "Encuesta"
  }

  salir() {
    this.cancelar.emit();
  }

  cambiarVista() {
    this.vistaAtenderPaciente = "Turnos";
  }

  agarrarError(error:string) {
    this.error.emit(error);
  }

  subirTurnoAtendido(turno:Turno) {
    this.turnosService.actualizarTurno(turno);
    this.cambiarVista();
    this.exito.emit("Turno Atendido");
  }
}
