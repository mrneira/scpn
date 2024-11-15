import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { AuditGeneralRoutingModule } from './auditGeneral.routing';
import { AuditGeneralComponent } from './componentes/auditGeneral.component';
import {DataListModule} from 'primeng/primeng';
import { LovTransaccionesModule } from '../../generales/lov/transacciones/lov.transacciones.module';

@NgModule({
  imports: [SharedModule, AuditGeneralRoutingModule, DataListModule, LovTransaccionesModule],
  declarations: [AuditGeneralComponent]
})
export class AuditGeneralModule { }
