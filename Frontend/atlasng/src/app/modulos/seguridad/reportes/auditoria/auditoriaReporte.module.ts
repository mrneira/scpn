import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AuditoriaReporteRoutingModule } from './auditoriaReporte.routing';

import { AuditoriaReporteComponent } from './componentes/auditoriaReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovUsuariosModule} from '../../lov/usuarios/lov.usuarios.module';
import { VisorPdfModule } from '../../../../util/componentes/pdfViwer/visorPdf.module';
import { LovTransaccionesModule } from '../../../generales/lov/transacciones/lov.transacciones.module';
@NgModule({
  imports: [SharedModule, AuditoriaReporteRoutingModule, JasperModule, LovUsuariosModule, VisorPdfModule,LovTransaccionesModule ],
  declarations: [AuditoriaReporteComponent]
})
export class AuditoriaReporteModule { }
