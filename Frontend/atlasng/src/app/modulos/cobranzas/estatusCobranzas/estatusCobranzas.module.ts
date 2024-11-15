import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { EstatusCobranzasRoutingModule } from './estatusCobranzas.routing';
import {LovUsuariosModule} from '../../seguridad/lov/usuarios/lov.usuarios.module';
import { EstatusCobranzasComponent } from './componentes/estatusCobranzas.component';


@NgModule({
  imports: [SharedModule, EstatusCobranzasRoutingModule, LovUsuariosModule],
  declarations: [EstatusCobranzasComponent]
})
export class EstatusCobranzasModule { }
