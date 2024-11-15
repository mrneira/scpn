import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { AuditUsuarioRoutingModule } from './auditUsuario.routing';
import { AuditUsuarioComponent } from './componentes/auditUsuario.component';
import {DataListModule} from 'primeng/primeng';
import { LovTransaccionesModule } from '../../generales/lov/transacciones/lov.transacciones.module';

@NgModule({
  imports: [SharedModule, AuditUsuarioRoutingModule, DataListModule, LovTransaccionesModule],
  declarations: [AuditUsuarioComponent]
})
export class AuditUsuarioModule { }
