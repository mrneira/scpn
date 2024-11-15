import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { AuditRolesRoutingModule } from './auditRoles.routing';
import { AuditRolesComponent } from './componentes/auditRoles.component';
import {DataListModule} from 'primeng/primeng';
import { LovTransaccionesModule } from '../../generales/lov/transacciones/lov.transacciones.module';
import {RadioButtonModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, AuditRolesRoutingModule, DataListModule, LovTransaccionesModule, RadioButtonModule],
  declarations: [AuditRolesComponent]
})
export class AuditRolesModule { }
