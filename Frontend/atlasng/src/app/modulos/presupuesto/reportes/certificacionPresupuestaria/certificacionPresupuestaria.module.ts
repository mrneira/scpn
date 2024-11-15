import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CertificacionPresupuestariaComponent } from './componentes/certificacionPresupuestaria.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { CertificacionPresupuestariaRoutingModule } from './certificacionPresupuestaria.routing';
import { LovCompromisoModule } from '../../lov/compromiso/lov.compromiso.module';

@NgModule({
  imports: [SharedModule, CertificacionPresupuestariaRoutingModule,LovCompromisoModule, JasperModule, SpinnerModule ],
  declarations: [CertificacionPresupuestariaComponent]
})
export class CertificacionPresupuestariaModule { }
