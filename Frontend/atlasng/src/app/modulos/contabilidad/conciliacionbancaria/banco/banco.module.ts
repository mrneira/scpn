import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { BancoRoutingModule } from './banco.routing';
import {LovUsuariosModule} from '../../../seguridad/lov/usuarios/lov.usuarios.module';
import { BancoComponent } from './componentes/banco.component';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
  imports: [SharedModule, BancoRoutingModule, LovUsuariosModule,LovCuentasContablesModule],
  declarations: [BancoComponent]
})
export class BancoModule { }
