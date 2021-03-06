import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TurnosService } from 'src/app/servicios/turnos.service';
import { Observable } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Turno } from 'src/app/clases/turno';

@Component({
  selector: 'app-turnos-profesional',
  templateUrl: './turnos-profesional.component.html',
  styleUrls: ['./turnos-profesional.component.scss']
})
export class TurnosProfesionalComponent implements OnInit {

  @Output() cancelar: EventEmitter<any> = new EventEmitter();
  turnos: Observable<any[]>;
  listaTurnos: any[];
  listaTurnosPendientes: any[];
  listaTurnosAceptados: any[];
  turno: Turno = new Turno();
  vistTurnosProfesional = "Tablas";

  constructor(private db : AngularFireDatabase, private turnosService:TurnosService, private usuarioService:UsuarioService) { 
    this.turnos = this.db.list('turnos').valueChanges(); 
    this.turnos.subscribe(turnos => {
      this.listaTurnos = turnos;
      this.usuarioService.obtenerTodosLosDatosDelUsuario().then((usuario:any) => {
        this.listaTurnos = this.listaTurnos.filter(turno => turno.idProfesional == usuario.id);
        this.listaTurnosPendientes = this.listaTurnos.filter(turno => turno.estado == "Pendiente");
        this.listaTurnosAceptados = this.listaTurnos.filter(turno => {
          if(turno.estado == "Aceptado" || turno.estado == "Atendido") {
            return turno;
          }
        });
        console.log(this.listaTurnos);
        console.log(this.listaTurnosPendientes);
        console.log(this.listaTurnosAceptados);
      }).catch((error:any) => console.log(error));
    }, error => console.log(error));
  }

  ngOnInit(): void {}

  salir() {
    this.cancelar.emit();
  }

  aceptarTurno(turno:Turno) {
    turno.estado = "Aceptado";
    this.turnosService.actualizarTurno(turno);
  }

  cancelarTurno(turno:Turno) {
    turno.estado = "Cancelado";
    this.turnosService.actualizarTurno(turno);
  }

  cambiarVista() {
    this.vistTurnosProfesional = "Tablas";
  }

  verReseniaPaciente(turno) {
    this.turno = turno;
    this.vistTurnosProfesional = "Reseña";
  }
}
